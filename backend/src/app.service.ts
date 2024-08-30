// import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI, openai } from '@ai-sdk/openai';
import { Browserbase } from '@browserbasehq/sdk';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CoreMessage, generateObject, generateText } from 'ai';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Browser, chromium, Page } from 'playwright';
import { Subject } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { capturePageSnapshot } from './lib/browser';
import { processHtmlAndSearch } from './lib/embed';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class AppService {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(AppService.name);
  private activeSessions: Map<
    string,
    {
      socket: Socket;
      stopSignal: Subject<void>;
      browser: Browser | null;
      browserbaseSessionId: string | null;
      debugUrl: string | undefined;
    }
  > = new Map();

  constructor(private configService: ConfigService) {}

  async allBirds() {
    // Getting the default context to ensure the sessions are recorded.

    const browserbase = new Browserbase();

    const { id } = await browserbase.createSession();

    // const browser = await chromium.connectOverCDP(
    //   `wss://connect.browserbase.com?apiKey=${this.configService.get('BROWSERBASE_API_KEY')}`,
    // );

    const browser = await chromium.connectOverCDP(
      browserbase.getConnectURL({ sessionId: id }),
    );
    const { debuggerFullscreenUrl: debugConnectionURL } =
      await browserbase.getDebugConnectionURLs(id);
    console.log({ debugConnectionURL });
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages()[0];
    await page.goto('https://allBirds.com/');
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

    await page.close();
    await browser.close();
  }

  aiManagerSchema = z.object({
    url: z.string().url(),
    taskTitle: z.string(),
    taskDescription: z.string(),
    maxSteps: z.number().int().positive().default(10),
    useBrowserBase: z.boolean().default(false),
  });

  actionSchema = z.object({
    title: z.string(),
    reason: z.string(),
    action: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('click'),
        selector: z.string().min(1),
      }),
      z.object({
        type: z.literal('type'),
        selector: z.string().min(1),
        text: z.string().min(1),
      }),
      z.object({
        type: z.literal('scroll'),
        selector: z.string().optional(),
      }),
      z.object({
        type: z.literal('wait'),
        duration: z.number().min(1),
      }),
      z.object({
        type: z.literal('select'),
        selector: z.string().min(1),
        value: z.union([z.string(), z.array(z.string())]),
      }),
      z.object({
        type: z.literal('checkOrUncheck'),
        selector: z.string().min(1),
        checked: z.boolean(),
      }),
      z.object({
        type: z.literal('pressKey'),
        key: z.string().min(1),
      }),
      z.object({
        type: z.literal('navigate'),
        url: z.string().url(),
      }),
      z.object({
        type: z.literal('waitForSelector'),
        selector: z.string().min(1),
        state: z.enum(['attached', 'detached', 'visible', 'hidden']),
      }),
      z.object({
        type: z.literal('waitForNavigation'),
      }),
      z.object({
        type: z.literal('finished'),
        reason: z.string(),
      }),
    ]),
    result: z.enum(['success', 'failed']).optional(),
    error: z.string().optional(),
  });

  @SubscribeMessage('startAiManager')
  startAiManager(
    @ConnectedSocket() client: Socket,
    @MessageBody() params: z.infer<typeof this.aiManagerSchema>,
  ): string {
    const sessionId = uuidv4();
    const stopSignal = new Subject<void>();

    this.activeSessions.set(sessionId, {
      socket: client,
      stopSignal,
      browser: null,
      browserbaseSessionId: null,
      debugUrl: undefined,
    });

    this.runAiManager(sessionId, params).catch((error) => {
      this.logger.error(`Error in aiManager session ${sessionId}`, error);
      client.emit('aiManagerUpdate', { type: 'error', message: error.message });
    });

    return sessionId;
  }

  @SubscribeMessage('stopAiManager')
  async stopAiManager(
    @ConnectedSocket() client: Socket,
    @MessageBody() sessionId: string,
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      this.logger.warn(`Session ${sessionId} not found for stopping`);
      return;
    }

    session.stopSignal.next();
    if (session.browser) {
      await session.browser.close();
    }
    client.emit('aiManagerUpdate', {
      type: 'stopped',
      message: 'Process stopped by user',
    });
    this.activeSessions.delete(sessionId);
  }

  private async runAiManager(
    sessionId: string,
    params: z.infer<typeof this.aiManagerSchema>,
  ) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const { socket, stopSignal } = session;
    const { url, taskTitle, taskDescription, maxSteps, useBrowserBase } =
      this.aiManagerSchema.parse(params);

    this.logger.log(
      `Starting AI Manager task for session ${sessionId}: ${taskTitle}`,
    );
    const startUpdate: AiManagerUpdate = {
      type: 'start',
      taskTitle,
      taskDescription,
    };
    socket.emit('aiManagerUpdate', startUpdate);

    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
      if (useBrowserBase) {
        const browserbase = new Browserbase();
        const { id } = await browserbase.createSession();
        session.browserbaseSessionId = id;
        browser = await chromium.connectOverCDP(
          browserbase.getConnectURL({ sessionId: id }),
        );
        const { debuggerFullscreenUrl } =
          await browserbase.getDebugConnectionURLs(id);
        session.debugUrl = debuggerFullscreenUrl;
        const debugUrlUpdate: AiManagerUpdate = {
          type: 'debugUrl',
          url: debuggerFullscreenUrl,
        };
        socket.emit('aiManagerUpdate', debugUrlUpdate);
        const defaultContext = browser.contexts()[0];
        page = defaultContext.pages()[0];
      } else {
        browser = await chromium.launch({ headless: false });
        page = await browser.newPage();
      }

      await page.setViewportSize({ width: 1920, height: 1080 });
      session.browser = browser;

      await page.goto(url);
      this.logger.log(`Navigated to URL: ${url}`);
      const navigationUpdate: AiManagerUpdate = { type: 'navigation', url };
      socket.emit('aiManagerUpdate', navigationUpdate);

      const actionsTaken: z.infer<typeof this.actionSchema>[] = [
        {
          title: 'Navigate to initial URL',
          reason: 'Starting the task',
          action: { type: 'navigate', url },
          result: 'success',
        },
      ];
      let stepCount = 0;

      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: this.configService.get('GROQ_API_KEY'),
      });

      const groqModel = groq('llama3-groq-70b-8192-tool-use-preview');

      while (stepCount < maxSteps) {
        if (stopSignal.observed) {
          this.logger.log(
            `Stop signal received for session ${sessionId}. Ending process.`,
          );
          break;
        }

        this.logger.log(
          `Processing step ${stepCount + 1} of ${maxSteps} for session ${sessionId}`,
        );
        const stepUpdate: AiManagerUpdate = {
          type: 'step',
          current: stepCount + 1,
          total: maxSteps,
        };
        socket.emit('aiManagerUpdate', stepUpdate);

        const { screenshot, cleanedHtml } = await capturePageSnapshot(page);

        // Generate a query based on past actions
        const queryText = await generateText({
          model: groqModel,
          prompt: `
          Based on the following task and actions taken, 
          generate a concise query to search for relevant HTML elements for the next step:
          ONLY RESPOND WITH THE HTML ELEMENTS or CSS selectors or XPATH or other selectors or text
          Task: ${taskTitle}
          Description: ${taskDescription}
          Actions taken: ${JSON.stringify(actionsTaken.slice(-5), null, 2)}   
          Query:`,
          maxTokens: 100,
        });

        const searchResults = (
          await processHtmlAndSearch(cleanedHtml, queryText.text, 5)
        )
          .join('\n')
          .replace(/\s+/g, ' ')
          .trim();

        const successActions = actionsTaken.filter(
          (action) => action.result === 'success',
        );
        const lastFailedAction = actionsTaken
          .reverse()
          .find((action) => action.result !== 'success');
        actionsTaken.reverse(); // Reverse back to original order

        const processedActions = lastFailedAction
          ? [...successActions, lastFailedAction]
          : successActions;

        const content = this.getSystemContent(
          taskTitle,
          taskDescription,
          stepCount,
        );

        const messages: CoreMessage[] = [
          { role: 'system', content },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Provide the next action to complete the task:

                    Task:
                    Title: ${taskTitle}
                    Description: ${taskDescription}

                    Actions taken so far:
                    ${JSON.stringify(processedActions.slice(-5), null, 2)} // Only include last 5 actions

                    Relevant HTML chunks: ${searchResults} 
                `,
              },
              { type: 'image', image: screenshot },
            ],
          },
        ];

        await this.saveContentAndMessages(stepCount, content, messages);

        this.logger.log('Generating next action with AI');
        const result = await generateObject({
          model: openai('gpt-4o'),
          // model: anthropic('claude-3-5-sonnet-20240620'),
          schema: this.actionSchema.omit({ result: true, error: true }),
          messages,
          maxRetries: 5,
        });

        const actionItem = result.object;
        this.logger.log(`AI generated action: ${JSON.stringify(actionItem)}`);
        const actionUpdate: AiManagerUpdate = {
          type: 'action',
          action: actionItem.action,
        };
        socket.emit('aiManagerUpdate', actionUpdate);

        if (actionItem.action.type === 'finished') {
          this.logger.log(`Task finished: ${actionItem.reason}`);
          const finishedUpdate: AiManagerUpdate = {
            type: 'finished',
            reason: actionItem.reason,
          };
          socket.emit('aiManagerUpdate', finishedUpdate);
          break;
        }

        this.logger.log(`Executing action: ${actionItem.action.type}`);
        try {
          await this.mapActionToCode(page, actionItem.action);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          actionsTaken.push({ ...actionItem, result: 'success' });
          const successUpdate: AiManagerUpdate = {
            type: 'actionResult',
            result: 'success',
            action: actionItem,
          };
          socket.emit('aiManagerUpdate', successUpdate);
        } catch (error) {
          this.logger.error(`Action failed: ${error.message}`);
          const { text: summary } = await generateText({
            model: groqModel,
            prompt: `Summarize the error: ${error.message.slice(0, 30000)}`,
            maxTokens: 1000,
          });
          actionsTaken.push({
            ...actionItem,
            result: 'failed',
            error: summary,
          });
          const failedUpdate: AiManagerUpdate = {
            type: 'actionResult',
            result: 'failed',
            action: actionItem,
            error: summary,
          };
          socket.emit('aiManagerUpdate', failedUpdate);
        }

        stepCount++;
      }

      if (stepCount >= maxSteps) {
        this.logger.warn(
          `Max steps (${maxSteps}) reached for session ${sessionId}. Task may be incomplete.`,
        );
        const maxStepsUpdate: AiManagerUpdate = {
          type: 'maxStepsReached',
          steps: maxSteps,
        };
        socket.emit('aiManagerUpdate', maxStepsUpdate);
      }

      const completeUpdate: AiManagerUpdate = {
        type: 'complete',
        actionsTaken,
      };
      socket.emit('aiManagerUpdate', completeUpdate);
    } catch (error) {
      this.logger.error(`Error in AI Manager session ${sessionId}`, error);
      socket.emit('aiManagerUpdate', { type: 'error', message: error.message });
    } finally {
      if (browser) {
        await browser.close();
      }
      session.browser = null;
      this.logger.log(
        `Browser closed for session ${sessionId}. Task completed.`,
      );
      this.activeSessions.delete(sessionId);
    }
  }

  private getSystemContent(
    taskTitle: string,
    taskDescription: string,
    stepCount: number,
  ): string {
    return `
      You are an expert QA engineer and Playwright automation specialist.
      Given a screenshot and parsed HTML of a webpage, generate the next action to complete the task.

      OUTPUT ONLY A SINGLE JSON OBJECT FOR THE NEXT ACTION
      The action should have a 'type' ('click', 'type', 'scroll', 'wait', 'select', 'checkOrUncheck', 'pressKey', 'navigate', 'waitForSelector', 'waitForNavigation', 'finished') and additional details.
      For 'click' actions, provide a 'selector'.
      For 'type' actions, provide both a 'selector' and 'text'.
      For 'scroll' actions, provide a 'selector' or coordinates.
      For 'wait' actions, provide a duration in milliseconds.

      If you believe the task is complete, output the following:
      { "type": "finished", "reason": "Explanation of why the task is finished" }

      Task context:
      Title: ${taskTitle}
      Description: ${taskDescription}
      Current step: ${stepCount + 1}

      Examples of input/output actions:
      Input: Click the "Sign Up" button
        Output: { "type": "click", "selector": "#sign-up-button" }

      Input: Enter email address
      Output: { "type": "type", "selector": "#email-input", "text": "user@example.com" }

      Input: Scroll to the bottom of the page
      Output: { "type": "scroll", "selector": "body" }

      Input: Wait for 2 seconds
      Output: { "type": "wait", "duration": 2000 }
    `;
  }

  private async saveContentAndMessages(
    stepCount: number,
    content: string,
    messages: CoreMessage[],
  ): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `output/${timestamp}_${stepCount}`;

    const contentFilename = `${baseFilename}_content.txt`;
    const messagesFilename = `${baseFilename}_messages.json`;

    this.logger.log(`Saving content to file: ${contentFilename}`);
    this.logger.log(`Saving messages to file: ${messagesFilename}`);

    // Ensure the output directory exists
    const outputDir = path.dirname(contentFilename);
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }

    // Write the content and messages to separate files
    await fs.writeFile(contentFilename, content, 'utf8');
    await fs.writeFile(
      messagesFilename,
      JSON.stringify(messages, null, 2),
      'utf8',
    );
  }

  private async mapActionToCode(
    page: Page,
    action: z.infer<typeof this.actionSchema>['action'],
  ): Promise<void> {
    this.logger.log(`Mapping action to code: ${action.type}`);
    switch (action.type) {
      case 'click':
        await page.click(action.selector);
        this.logger.log(`Clicked element: ${action.selector}`);
        break;
      case 'type':
        await page.fill(action.selector, action.text);
        this.logger.log(`Typed text into element: ${action.selector}`);
        break;
      case 'scroll':
        if (action.selector) {
          await page.evaluate((selector) => {
            document.querySelector(selector)?.scrollIntoView();
          }, action.selector);
          this.logger.log(`Scrolled to element: ${action.selector}`);
        } else {
          await page.evaluate(() => window.scrollBy(0, 500));
          this.logger.log('Scrolled down 500 pixels');
        }
        break;
      case 'wait':
        await page.waitForTimeout(action.duration);
        this.logger.log(`Waited for ${action.duration}ms`);
        break;
      case 'select':
        await page.selectOption(action.selector, action.value);
        this.logger.log(`Selected option in element: ${action.selector}`);
        break;
      case 'checkOrUncheck':
        await page.setChecked(action.selector, action.checked);
        this.logger.log(`Set checked state of element: ${action.selector}`);
        break;
      case 'pressKey':
        await page.keyboard.press(action.key);
        this.logger.log(`Pressed key: ${action.key}`);
        break;
      case 'navigate':
        await page.goto(action.url);
        this.logger.log(`Navigated to URL: ${action.url}`);
        break;
      case 'waitForSelector':
        await page.waitForSelector(action.selector, {
          state: action.state,
        });
        this.logger.log(`Waited for selector: ${action.selector}`);
        break;
      case 'waitForNavigation':
        await page.waitForNavigation();
        this.logger.log('Waited for navigation');
        break;
      case 'finished':
        // No action needed for 'finished' type
        break;
      default:
        this.logger.warn(`Unhandled action type: ${(action as any).type}`);
    }
  }
}

type AiManagerUpdate =
  | { type: 'start'; taskTitle: string; taskDescription: string }
  | { type: 'debugUrl'; url: string | undefined }
  | { type: 'navigation'; url: string }
  | { type: 'step'; current: number; total: number }
  | { type: 'action'; action: z.infer<typeof this.actionSchema>['action'] }
  | {
      type: 'actionResult';
      result: 'success' | 'failed';
      action: any;
      error?: string;
    }
  | { type: 'finished'; reason: string }
  | { type: 'maxStepsReached'; steps: number }
  | { type: 'complete'; actionsTaken: z.infer<typeof this.actionSchema>[] }
  | { type: 'stopped'; message: string }
  | { type: 'error'; message: string };
