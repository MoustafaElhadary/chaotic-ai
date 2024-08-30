import { useState, useRef, useCallback, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export type AiManagerUpdate =
  | { type: 'start'; taskTitle: string; taskDescription: string }
  | { type: 'debugUrl'; url: string | undefined }
  | { type: 'navigation'; url: string }
  | { type: 'step'; current: number; total: number }
  | { type: 'action'; action: any }
  | {
      type: 'actionResult'
      result: 'success' | 'failed'
      action: any
      error?: string
    }
  | { type: 'finished'; reason: string }
  | { type: 'maxStepsReached'; steps: number }
  | { type: 'complete'; actionsTaken: any[] }
  | { type: 'stopped'; message: string }

export interface Task {
  id: number
  url: string
  title: string
  description: string
  status: 'running' | 'completed' | 'failed' | 'stopped'
  sessionId?: string
  debugUrl?: string
  updates: AiManagerUpdate[]
}

export function useAiManagerWebSocket() {
  const [task, setTask] = useState<Task | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [iframeUrl, setIframeUrl] = useState('')

  const socketRef = useRef<Socket | null>(null)

  const cleanupSocket = useCallback(() => {
    if (socketRef.current) {
      console.log('Closing WebSocket connection')
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  const setupSocket = useCallback(() => {
    if (!socketRef.current) {
      console.log('Setting up WebSocket connection')
      const socket = io(BACKEND_URL)
      socketRef.current = socket

      socket.on('connect', () => {
        console.log('WebSocket connection opened')
      })

      socket.on('aiManagerUpdate', (update: AiManagerUpdate) => {
        console.log('Received WebSocket event:', update)

        setTask(prevTask => {
          if (!prevTask) return null
          return { ...prevTask, updates: [...prevTask.updates, update] }
        })

        if (update.type === 'start') {
          setIsRunning(true)
        } else if (update.type === 'debugUrl') {
          setIframeUrl(update.url || '')
        } else if (
          ['complete', 'maxStepsReached', 'stopped', 'error'].includes(update.type)
        ) {
          setIsRunning(false)
          if (update.type === 'stopped') {
            setTask(prevTask => prevTask ? { ...prevTask, status: 'stopped' } : null)
          }
          cleanupSocket()
        }
      })
    }
  }, [cleanupSocket])

  const startAiManager = useCallback(
    (url: string, taskTitle: string, taskDescription: string) => {
      setupSocket()

      if (socketRef.current) {
        const params = {
          url,
          taskTitle,
          taskDescription,
          maxSteps: 10,
          useBrowserBase: true
        }

        socketRef.current.emit(
          'startAiManager',
          params,
          (response: { sessionId: string }) => {
            console.log('startAiManager response:', response)
            const newTask: Task = {
              id: Date.now(),
              url,
              title: taskTitle,
              description: taskDescription,
              status: 'running',
              sessionId: response.sessionId,
              updates: []
            }
            setTask(newTask)
            setIsRunning(true)
          }
        )
      } else {
        console.error('Failed to start AI Manager: WebSocket not connected')
      }
    },
    [setupSocket]
  )

  const stopAiManager = useCallback(() => {
    if (socketRef.current && task?.sessionId) {
      socketRef.current.emit('stopAiManager', task.sessionId)
    } else {
      console.error('Failed to stop AI Manager: WebSocket not connected or no active task')
    }
  }, [task])

  useEffect(() => {
    return () => {
      cleanupSocket()
    }
  }, [cleanupSocket])

  return {
    task,
    isRunning,
    iframeUrl,
    startAiManager,
    stopAiManager
  }
}
