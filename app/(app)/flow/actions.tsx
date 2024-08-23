'use server'

import { UpdateState } from '@/components/update-state'
import { flowSchema, stepsSchema } from '@/lib/flow'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { generateId, generateObject } from 'ai'
import { createAI, getMutableAIState, streamUI } from 'ai/rsc'
import { ReactNode } from 'react'
import { z } from 'zod'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

const model = groq('llama3-groq-70b-8192-tool-use-preview')
// const model = openai('gpt-4o-mini')

const generateSteps = async (flow: z.infer<typeof flowSchema>) => {
  const { object } = await generateObject({
    model,
    prompt: `
    You are an expert at generating a list of steps for a QA flow.
    You are given a flow and a list of steps.
    You are asked to generate a list of steps for the flow.
    You are always finding the steps that are missing from the flow and are creative in your steps.
    Given the following flow:
    ${flow.name}
    ${flow.description}
    ${flow.url}
    and current steps:
    ${flow.steps.map(step => step.description).join('\n')}
    Generate a list of steps for that flow. 
    `,
    schema: stepsSchema,
    maxRetries: 3
  })
  return object
}

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
  currentFlow: z.infer<typeof flowSchema>
): Promise<ClientMessage> {
  'use server'

  const history = getMutableAIState()
  console.log(history.get())

  const system = `
    You are an expert QA web Engineer. here is the JSON representation of the current flow:
    ${JSON.stringify(currentFlow, null, 2)}
    You are asked to continue the conversation based on the current flow.
    You are always finding the steps that are missing from the flow and are creative in your steps.
  `
  const result = await streamUI({
    // model: openai('gpt-4o-mini'),
    model,
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
    }
  },
  initialUIState: []
})
