'use client'
import { useEffect } from 'react'
import { z } from 'zod'
import {
  flowSchema,
  useFlowContext
} from '../app/(app)/flow/components/FlowContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from './ui/accordion'
import { Card, CardContent } from './ui/card'

export const UpdateState = ({ flow }: { flow: z.infer<typeof flowSchema> }) => {
  const { form } = useFlowContext()

  useEffect(() => {
    form.setValue('name', flow.name)
    form.setValue('url', flow.url)
    form.setValue('description', flow.description)
    form.setValue('steps', flow.steps)
  }, [])

  return (
    <>
      <h3>here is the updated info</h3>
      <Card className="mt-4">
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>View</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {flow.name}
                  </p>
                  <p>
                    <strong>URL:</strong> {flow.url}
                  </p>
                  <p>
                    <strong>Description:</strong> {flow.description}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </>
  )
}
