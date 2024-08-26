'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronUp, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  AiManagerUpdate,
  Task,
  useAiManagerSSEStream
} from './useAiManagerSSEStream'

export default function Component() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const {
    tasks,
    isRunning,
    currentTaskId,
    iframeUrl,
    startAiManager,
    stopAiManager,
    setTasks
  } = useAiManagerSSEStream()

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log('handleAction called') // Debugging log
    if (isRunning) {
      console.log('Stopping task:', currentTaskId) // Debugging log
      stopAiManager(currentTaskId!)
    } else {
      console.log('Starting new task') // Debugging log
      const newTask: Task = {
        id: Date.now(),
        url,
        title,
        description,
        status: 'running',
        updates: []
      }
      console.log('New task:', newTask) // Debugging log
      setTasks(prevTasks => {
        console.log('Previous tasks:', prevTasks) // Debugging log
        return [...prevTasks, newTask]
      })
      startAiManager(newTask.id, url, title, description)
    }
  }

  const toggleRowExpansion = (taskId: number) => {
    setExpandedRows(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }
  const renderUpdateContent = (update: AiManagerUpdate) => {
    switch (update.type) {
      case 'action':
      case 'actionResult':
        return (
          <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto mt-2">
            {JSON.stringify(update.action, null, 2)}
          </pre>
        )
      case 'complete':
        return (
          <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto mt-2">
            {JSON.stringify(update.actionsTaken, null, 2)}
          </pre>
        )
      default:
        return JSON.stringify(update)
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 overflow-auto">
        <div className="space-y-4 mb-8">
          <Input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            disabled={isRunning}
          />
          <Input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            disabled={isRunning}
          />
          <Textarea
            placeholder="Task Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            disabled={isRunning}
          />
          <Button
            type="button"
            onClick={handleAction}
            className="w-full"
            disabled={!url || !title || !description} // Disable button if fields are empty
          >
            {isRunning ? (
              <>
                <Square className="mr-2 h-4 w-4" /> Stop Task
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Run Task
              </>
            )}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map(task => (
              <React.Fragment key={task.id}>
                <TableRow>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.url}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'running'
                          ? 'bg-yellow-200 text-yellow-800'
                          : task.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRowExpansion(task.id)}
                    >
                      {expandedRows.includes(task.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedRows.includes(task.id) && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="p-4 bg-muted rounded-md">
                        <h4 className="font-semibold mb-2">Description:</h4>
                        <p>{task.description}</p>
                        {task.debugUrl && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Debug URL:</h4>
                            <a
                              href={task.debugUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {task.debugUrl}
                            </a>
                          </div>
                        )}
                        <h4 className="font-semibold mt-4 mb-2">Updates:</h4>
                        <ul className="list-disc pl-5">
                          {task.updates.map((update, index) => (
                            <li key={index} className="mb-4">
                              <strong>{update.type}:</strong>
                              {renderUpdateContent(update)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-1/2 p-4 bg-muted">
        <div className="bg-white w-full h-full rounded-lg overflow-hidden relative aspect-video">
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              //   className="w-full h-full border-none"
              allow="clipboard-read; clipboard-write"
              width="100%"
              height="100%"
              allowFullScreen
              className="absolute inset-0 w-full h-full border rounded-lg"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No active task
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
