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

  const setupSocket = useCallback(
    (sessionId: string) => {
      cleanupSocket()

      const socket = io(BACKEND_URL)
      socketRef.current = socket

      socket.on('connect', () => {
        console.log('WebSocket connection opened')
        setIsRunning(true)
      })

      socket.on(`aiManager:${sessionId}`, (update: AiManagerUpdate) => {
        console.log('Received WebSocket event:', update)

        setTask(prevTask => {
          if (!prevTask) return null
          return { ...prevTask, updates: [...prevTask.updates, update] }
        })

        if (update.type === 'debugUrl') {
          setIframeUrl(update.url || '')
        } else if (
          ['complete', 'maxStepsReached', 'stopped'].includes(update.type)
        ) {
          setIsRunning(false)
          cleanupSocket()
        }
      })

      socket.on(`aiManager:${sessionId}:error`, (error: any) => {
        console.error('WebSocket error:', error)
        setIsRunning(false)
        cleanupSocket()
      })

      socket.on(`aiManager:${sessionId}:complete`, () => {
        setIsRunning(false)
        cleanupSocket()
      })
    },
    [cleanupSocket]
  )

  const startAiManager = useCallback(
    async (url: string, taskTitle: string, taskDescription: string) => {
      const response = await fetch(`${BACKEND_URL}/ai-manager/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          taskTitle,
          taskDescription,
          maxSteps: 10,
          useBrowserBase: true
        })
      })
      if (response.ok) {
        const data = await response.json()
        const newTask: Task = {
          id: Date.now(),
          url,
          title: taskTitle,
          description: taskDescription,
          status: 'running',
          sessionId: data.sessionId,
          updates: []
        }
        setTask(newTask)
        setIsRunning(true)
        setupSocket(data.sessionId)
      } else {
        console.error('Failed to start AI Manager')
      }
    },
    [setupSocket]
  )

  const stopAiManager = useCallback(async () => {
    if (!task || !task.sessionId) return

    socketRef.current?.emit('stopAiManager', task.sessionId)
    setTask(prevTask => (prevTask ? { ...prevTask, status: 'stopped' } : null))
    setIsRunning(false)
    setIframeUrl('')
    cleanupSocket()
  }, [task, cleanupSocket])

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
