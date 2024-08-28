'use server'

import { UpdateState } from '@/components/update-state'
import { flowSchema, stepsSchema } from '@/lib/flow'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { generateId, generateObject } from 'ai'
import { createAI, getMutableAIState, streamUI } from 'ai/rsc'
import { ReactNode } from 'react'
import { z } from 'zod'
import { UpdateFlowSettings } from './components/UpdateFlowSettings'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

const model = groq('llama3-groq-70b-8192-tool-use-preview')
// const model = openai('gpt-4o-mini')

const generateFlowInfo = async (flow: z.infer<typeof flowSchema>) => {
  const { object } = await generateObject({
    model,
    prompt: `
    You are an expert QA web Engineer.
    Given the following information about a flow, update what is missing and return back what is there: 
    name: ${flow.name}
    description: ${flow.description}
    url: ${flow.url}
    `,
    schema: flowSchema.omit({ steps: true }),
    maxRetries: 3
  })
  return { ...object, steps: flow.steps }
}

interface FlowSettings {
  envVars: { key: string; value: string }[]
  schedule: string
  createJiraCard: boolean
  createGithubPR: boolean
  webhookUrl: string
}

export interface ServerMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClientMessage {
  id: string
  role: 'user' | 'assistant'
  display: ReactNode
}

export async function continueConversation(
  input: string,
  currentFlow: z.infer<typeof flowSchema>,
  currentFlowSettings: FlowSettings
): Promise<ClientMessage> {
  'use server'

  const history = getMutableAIState()
  console.log(history.get())

  const system = `
    You are an expert QA web Engineer. Here is the JSON representation of the current flow:
    ${JSON.stringify(currentFlow, null, 2)}
    
    And here are the current flow settings:
    ${JSON.stringify(currentFlowSettings, null, 2)}
    
    You are asked to continue the conversation based on the current flow and settings.
    You are always finding the steps that are missing from the flow and are creative in your steps.
    When updating flow settings, be specific about which settings to change and how.
  `
  const result = await streamUI({
    model: openai('gpt-4o-mini'),
    // model,
    system,
    messages: [...history.get().messages, { role: 'user', content: input }],
    text: ({ content, done }) => {
      console.log('content', content)
      if (done) {
        history.done(({ messages }: { messages: ServerMessage[] }) => ({
          ...messages,
          messages: [...messages, { role: 'assistant', content }]
        }))
      }

      if (content.length < 0) {
        return <div>thinking...</div>
      }

      return <div>{content}</div>
    },
    tools: {
      generateFlowInfo: {
        description: 'Generate the missing information for a flow',
        parameters: flowSchema,
        generate: async function* (flowParams) {
          yield <div>thinking...</div>

          const flow = await generateFlowInfo(flowParams)

          return <UpdateState flow={flow} />
        }
      },
      updateFlowSettings: {
        description: 'Update the flow settings',
        parameters: z.object({
          envVars: z
            .array(z.object({ key: z.string(), value: z.string() }))
            .optional(),
          addEnvVar: z
            .object({ key: z.string(), value: z.string() })
            .optional(),
          removeEnvVar: z.number().optional(),
          clearEnvVars: z.boolean().optional(),
          schedule: z.string().optional(),
          createJiraCard: z.boolean().optional(),
          createGithubPR: z.boolean().optional(),
          webhookUrl: z.string().optional()
        }),
        generate: async function* (
          settings: Partial<FlowSettings> & {
            addEnvVar?: { key: string; value: string }
            removeEnvVar?: number
            clearEnvVars?: boolean
          }
        ) {
          yield <div>Updating flow settings...</div>

          console.log('settings', settings)
          return <UpdateFlowSettings settings={settings} />
        }
      }
      // ... other tools ...
    }
  })

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value
  }
}

export const AI = createAI<
  {
    messages: ServerMessage[]
    currentFlow: z.infer<typeof flowSchema>
    flowSettings: FlowSettings
  },
  ClientMessage[]
>({
  actions: {
    continueConversation
  },
  initialAIState: {
    messages: [],
    currentFlow: {
      name: '',
      url: '',
      description: '',
      steps: []
    },
    flowSettings: {
      envVars: [],
      schedule: '',
      createJiraCard: false,
      createGithubPR: false,
      webhookUrl: ''
    }
  },
  initialUIState: []
})
