'use server'

import { createAI, getMutableAIState, streamUI } from 'ai/rsc'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { ReactNode } from 'react'
import { z } from 'zod'
import { generateId } from 'ai'

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
  input: string
): Promise<ClientMessage> {
  'use server'

  const history = getMutableAIState()

  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY
  })

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    // model: groq('llama3-groq-70b-8192-tool-use-preview'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content }
        ])
      }

      return <div>{content}</div>
    },
    tools: {
      deploy: {
        description: 'Deploy repository to vercel',
        parameters: z.object({
          repositoryName: z
            .string()
            .describe('The name of the repository, example: vercel/ai-chatbot')
        }),
        generate: async function* ({ repositoryName }) {
          yield <div>Cloning repository {repositoryName}...</div> // [!code highlight:5]
          await new Promise(resolve => setTimeout(resolve, 3000))
          yield <div>Building repository {repositoryName}...</div>
          await new Promise(resolve => setTimeout(resolve, 2000))
          return <div>{repositoryName} deployed!</div>
        }
      }
    }
  })

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value
  }
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation
  },
  initialAIState: [],
  initialUIState: []
})
