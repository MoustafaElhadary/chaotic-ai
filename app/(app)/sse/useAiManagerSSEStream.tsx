import { useState, useRef, useCallback } from 'react'

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

export function useAiManagerSSEStream() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null)
  const [iframeUrl, setIframeUrl] = useState('')

  const eventSourceRef = useRef<EventSource | null>(null)

  const cleanupEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('Closing SSE connection')
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  const setupEventSource = useCallback(
    (sessionId: string) => {
      cleanupEventSource()

      console.log('Starting SSE stream for session', sessionId)
      const eventSource = new EventSource(
        `${BACKEND_URL}/ai-manager/stream/${sessionId}`
      )
      eventSourceRef.current = eventSource

      eventSource.onopen = () => console.log('SSE connection opened')

      eventSource.onmessage = event => {
        console.log('Received SSE event:', event.data)
        const update: AiManagerUpdate = JSON.parse(event.data)

        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.sessionId === sessionId
              ? {
                  ...task,
                  updates: [...task.updates, update],
                  debugUrl:
                    update.type === 'debugUrl' ? update.url : task.debugUrl,
                  status: ['complete', 'maxStepsReached', 'stopped'].includes(
                    update.type
                  )
                    ? 'completed'
                    : task.status
                }
              : task
          )
        )

        if (update.type === 'debugUrl') {
          setIframeUrl(update.url || '')
        }

        if (['complete', 'maxStepsReached', 'stopped'].includes(update.type)) {
          setIsRunning(false)
          setCurrentTaskId(null)
          cleanupEventSource()
        }
      }

      eventSource.onerror = () => {
        console.error('SSE error')
        setIsRunning(false)
        setCurrentTaskId(null)
        setIframeUrl('')
        cleanupEventSource()
      }
    },
    [cleanupEventSource]
  )

  const startAiManager = useCallback(
    async (
      taskId: number,
      url: string,
      taskTitle: string,
      taskDescription: string
    ) => {
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
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? { ...task, sessionId: data.sessionId, status: 'running' }
              : task
          )
        )
        setIsRunning(true)
        setCurrentTaskId(taskId)
        setupEventSource(data.sessionId)
      } else {
        console.error('Failed to start AI Manager')
      }
    },
    [setupEventSource]
  )

  const stopAiManager = useCallback(
    async (taskId: number) => {
      const task = tasks.find(t => t.id === taskId)
      if (!task || !task.sessionId) return

      const response = await fetch(
        `${BACKEND_URL}/ai-manager/stop/${task.sessionId}`,
        { method: 'POST' }
      )
      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(t =>
            t.id === taskId ? { ...t, status: 'stopped' } : t
          )
        )
        setIsRunning(false)
        setCurrentTaskId(null)
        setIframeUrl('')
        cleanupEventSource()
      } else {
        console.error('Failed to stop AI Manager')
      }
    },
    [tasks, cleanupEventSource]
  )

  return {
    tasks,
    isRunning,
    currentTaskId,
    iframeUrl,
    startAiManager,
    stopAiManager,
    setTasks
  }
}
