import { z } from 'zod'

export const stepsSchema = z.array(
  z.object({
    id: z.string(),
    description: z.string()
  })
)
export const flowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().min(1, 'URL is required'),
  description: z.string(),
  steps: stepsSchema
})
