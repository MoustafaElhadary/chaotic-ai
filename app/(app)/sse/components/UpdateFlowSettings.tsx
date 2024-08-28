'use client'

import { useEffect } from 'react'
import { useFlowContext } from './FlowContext'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

interface UpdateFlowSettingsProps {
  settings: Partial<{
    envVars: { key: string; value: string }[]
    schedule: string
    createJiraCard: boolean
    createGithubPR: boolean
    webhookUrl: string
  }>
}

export const UpdateFlowSettings = ({ settings }: UpdateFlowSettingsProps) => {
  const { updateFlowSettings } = useFlowContext()

  useEffect(() => {
    updateFlowSettings(settings)
  }, [settings])

  return (
    <>
      <h3>Updated Flow Settings</h3>
      <Card className="mt-4">
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>View Updates</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {settings.envVars && (
                    <p>
                      <strong>Environment Variables:</strong>{' '}
                      {settings.envVars
                        .map(env => `${env.key}=${env.value}`)
                        .join(', ')}
                    </p>
                  )}
                  {settings.schedule !== undefined && (
                    <p>
                      <strong>Schedule:</strong> {settings.schedule}
                    </p>
                  )}
                  {settings.createJiraCard !== undefined && (
                    <p>
                      <strong>Create JIRA Card:</strong>{' '}
                      {settings.createJiraCard ? 'Yes' : 'No'}
                    </p>
                  )}
                  {settings.createGithubPR !== undefined && (
                    <p>
                      <strong>Create GitHub PR:</strong>{' '}
                      {settings.createGithubPR ? 'Yes' : 'No'}
                    </p>
                  )}
                  {settings.webhookUrl !== undefined && (
                    <p>
                      <strong>Webhook URL:</strong> {settings.webhookUrl}
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </>
  )
}
