import { publicProcedure, router } from '@/lib/server/trpc'
import { z } from 'zod'
import { createOpenAI } from '@ai-sdk/openai'
import { generateObject } from 'ai'

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

const model = groq('llama3-groq-70b-8192-tool-use-preview')

export const taskActionsRouter = router({
  generateTitle: publicProcedure
    .input(
      z.object({
        url: z.string().optional(),
        description: z.string(),
        title: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      const response = await generateObject({
        model,
        prompt: `Given the following task information, evaluate if a new title is necessary:
                URL (could be empty): ${input.url}
                Description : ${input.description}
                Current Title (could be empty): ${input.title}

                If the current title is empty, generate a new title.
                If the current title adequately describes the task, return it unchanged.
                Only suggest a new title if it would significantly improve clarity or accuracy.
                
                Title:`,
        schema: z.object({
          title: z.string()
        })
      })
      return response.object
    }),

  improveDescription: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ input }) => {
      const response = await generateObject({
        model,
        prompt: `Review the following description and determine if improvements are necessary:
                ${input.description}
                
                Only suggest changes if they significantly improve clarity, correct major errors, or make the description more step-by-step for a QA process.
                If the current description is already clear and suitable, return it unchanged.
                
                Improved description:`,
        schema: z.object({
          improvedDescription: z.string()
        })
      })
      return response.object
    }),

  validateUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const response = await generateObject({
        model,
        prompt: `Check if the following URL is a valid URI:
                ${input.url}
                
                Is it valid? (true/false):
                Only suggest a corrected URL if there's a clear and significant improvement:`,
        schema: z.object({
          isValid: z.boolean(),
          correctedUrl: z.string().url()
        })
      })
      return response.object
    })
})
