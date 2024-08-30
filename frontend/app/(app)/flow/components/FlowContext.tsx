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

  const form = useForm<FlowFormValues>({
    resolver: zodResolver(flowSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      steps: [{ id: '1', description: '' }]
    }
  })

  return (
    <FlowContext.Provider
      value={{
        form,
        showConfetti,
        setShowConfetti,
        showAlert,
        setShowAlert,
        alertText,
        setAlertText
      }}
    >
      {children}
    </FlowContext.Provider>
  )
}
