'use client'

import React, { createContext, useContext, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flowSchema } from '@/lib/flow'

export type FlowFormValues = z.infer<typeof flowSchema>

interface FlowContextType {
  form: ReturnType<typeof useForm<FlowFormValues>>
  showConfetti: boolean
  setShowConfetti: (show: boolean) => void
  showAlert: boolean
  setShowAlert: (show: boolean) => void
  alertText: string
  setAlertText: (text: string) => void
  envVars: { key: string; value: string }[]
  addEnvVar: () => void
  removeEnvVar: (index: number) => void
  updateEnvVar: (index: number, field: 'key' | 'value', value: string) => void
  schedule: string
  setSchedule: React.Dispatch<React.SetStateAction<string>>
  createJiraCard: boolean
  setCreateJiraCard: React.Dispatch<React.SetStateAction<boolean>>
  createGithubPR: boolean
  setCreateGithubPR: React.Dispatch<React.SetStateAction<boolean>>
  webhookUrl: string
  setWebhookUrl: React.Dispatch<React.SetStateAction<string>>
  updateFlowSettings: (settings: Partial<FlowSettings>) => void
  clearEnvVars: () => void
}

interface FlowSettings {
  envVars: { key: string; value: string }[]
  schedule: string
  createJiraCard: boolean
  createGithubPR: boolean
  webhookUrl: string
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export const useFlowContext = () => {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowProvider')
  }
  return context
}

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertText, setAlertText] = useState('')
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ])
  const [schedule, setSchedule] = useState('')
  const [createJiraCard, setCreateJiraCard] = useState(false)
  const [createGithubPR, setCreateGithubPR] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('')

  const form = useForm<FlowFormValues>({
    resolver: zodResolver(flowSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      steps: [{ id: '1', description: '' }]
    }
  })

  const addEnvVar = (newVar?: { key: string; value: string }) => {
    setEnvVars(prev => [...prev, newVar || { key: '', value: '' }])
  }

  const removeEnvVar = (index: number) => {
    setEnvVars(prev => prev.filter((_, i) => i !== index))
  }

  const updateEnvVar = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    setEnvVars(prev => {
      const newEnvVars = [...prev]
      newEnvVars[index][field] = value
      return newEnvVars
    })
  }

  const clearEnvVars = () => {
    setEnvVars([])
  }

  const updateFlowSettings = (settings: Partial<FlowSettings>) => {
    if (settings.envVars) {
      // Handle env vars update
      if (settings.envVars.length === 0) {
        clearEnvVars()
      } else {
        settings.envVars.forEach((envVar, index) => {
          if (index < envVars.length) {
            // Update existing
            updateEnvVar(index, 'key', envVar.key)
            updateEnvVar(index, 'value', envVar.value)
          } else {
            // Add new
            addEnvVar(envVar)
          }
        })
        // Remove extra if new list is shorter
        while (envVars.length > settings.envVars.length) {
          removeEnvVar(envVars.length - 1)
        }
      }
    }
    if (settings.schedule !== undefined) setSchedule(settings.schedule)
    if (settings.createJiraCard !== undefined)
      setCreateJiraCard(settings.createJiraCard)
    if (settings.createGithubPR !== undefined)
      setCreateGithubPR(settings.createGithubPR)
    if (settings.webhookUrl !== undefined) setWebhookUrl(settings.webhookUrl)
  }

  return (
    <FlowContext.Provider
      value={{
        form,
        showConfetti,
        setShowConfetti,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText,
        envVars,
        addEnvVar,
        removeEnvVar,
        updateEnvVar,
        clearEnvVars,
        schedule,
        setSchedule,
        createJiraCard,
        setCreateJiraCard,
        createGithubPR,
        setCreateGithubPR,
        webhookUrl,
        setWebhookUrl,
        updateFlowSettings
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}
