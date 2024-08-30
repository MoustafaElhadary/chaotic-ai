'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { trpc } from '@/lib/trpc/client'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import {
  AlertCircle,
  FileSearch,
  Keyboard,
  MousePointerClick,
  Navigation,
  Play,
  Square
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ChatDisplay } from './components/chat'
import { FlowProvider } from './components/FlowContext'
import { Sidebar } from './components/sidebar'
import { AiManagerUpdate, useAiManagerWebSocket } from './useAiManagerWebSocket'
import SettingsComponent from './components/SettingsComponent'

export default function SSEPageContent() {
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [lastProcessedUrl, setLastProcessedUrl] = useState('')
  const [lastProcessedDescription, setLastProcessedDescription] = useState('')
  const [isAccordionOpen, setIsAccordionOpen] = useState(true)
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)

  const { task, isRunning, iframeUrl, startAiManager, stopAiManager } =
    useAiManagerWebSocket()

  const generateTitleMutation = trpc.taskActions.generateTitle.useMutation({
    onSuccess: data => {
      if (data.title && data.title !== title) {
        if (!title) {
          setTitle(data.title)
          toast.success('Title automatically set', {
            description: data.title
          })
        } else {
          toast('New task title suggestion', {
            description: data.title,
            action: {
              label: 'Accept',
              onClick: () => setTitle(data.title)
            }
          })
        }
      }
    }
  })

  const improveDescriptionMutation =
    trpc.taskActions.improveDescription.useMutation({
      onSuccess: data => {
        if (
          data.improvedDescription &&
          data.improvedDescription !== description
        ) {
          toast('Description improved', {
            description: 'Review the updated description',
            action: {
              label: 'Accept',
              onClick: () => setDescription(data.improvedDescription)
            }
          })
        }
      }
    })

  const validateUrlMutation = trpc.taskActions.validateUrl.useMutation({
    onSuccess: data => {
      if (!data.isValid && data.correctedUrl && data.correctedUrl !== url) {
        toast('Invalid URL', {
          description: `Suggested URL: ${data.correctedUrl}`,
          action: {
            label: 'Accept',
            onClick: () => data.correctedUrl && setUrl(data.correctedUrl)
          }
        })
      } else if (data.isValid) {
        toast.success('Valid URL')
      }
    }
  })

  const debouncedGenerateTitle = useCallback(
    debounce((url: string, description: string, currentTitle: string) => {
      if (url && description) {
        generateTitleMutation.mutate({ url, description, title: currentTitle })
      }
    }, 300), // Increased debounce time for better performance
    [generateTitleMutation]
  )

  const debouncedImproveDescription = useCallback(
    debounce((description: string) => {
      if (description) {
        improveDescriptionMutation.mutate({ description })
      }
    }, 100),
    [improveDescriptionMutation]
  )

  const debouncedValidateUrl = useCallback(
    debounce((url: string) => {
      if (url) {
        validateUrlMutation.mutate({ url })
      }
    }, 100),
    [validateUrlMutation]
  )

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleUrlBlur = () => {
    if (url !== lastProcessedUrl) {
      debouncedValidateUrl(url)
      setLastProcessedUrl(url)
      if (description) {
        debouncedGenerateTitle(url, description, title)
      }
    }
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value)
  }

  const handleDescriptionBlur = () => {
    if (description !== lastProcessedDescription) {
      debouncedImproveDescription(description)
      setLastProcessedDescription(description)
      if (url) {
        debouncedGenerateTitle(url, description, title)
      }
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (isRunning) {
      stopAiManager()
    } else {
      startAiManager(url, title, description)
      setIsAccordionOpen(false)
      toast.success('Task started', {
        description: 'The AI manager is now running your task.'
      })
    }
  }

  const toggleRowExpansion = (taskId: number) => {
    setExpandedRows(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const renderGroupedUpdates = (updates: AiManagerUpdate[]) => {
    const groupedUpdates: AiManagerUpdate[][] = []
    let currentGroup: AiManagerUpdate[] = []

    updates.forEach((update, index) => {
      if (update.type === 'step') {
        if (currentGroup.length > 0) {
          groupedUpdates.push(currentGroup)
        }
        currentGroup = [update]
      } else if (['action', 'actionResult'].includes(update.type)) {
        currentGroup.push(update)
      } else {
        if (currentGroup.length > 0) {
          groupedUpdates.push(currentGroup)
        }
        groupedUpdates.push([update])
        currentGroup = []
      }

      if (index === updates.length - 1 && currentGroup.length > 0) {
        groupedUpdates.push(currentGroup)
      }
    })

    return groupedUpdates.map((group, groupIndex) => (
      <Card key={groupIndex}>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            {getStepIcon(group[0].type)}
            <span className="ml-2">
              {group[0].type === 'step'
                ? `Step ${(group[0] as any).current}`
                : group[0].type}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {group.map((update, updateIndex) => (
            <div key={updateIndex} className="mb-2">
              {renderUpdateContent(update)}
            </div>
          ))}
        </CardContent>
      </Card>
    ))
  }

  const renderUpdateContent = (update: AiManagerUpdate) => {
    switch (update.type) {
      case 'navigation':
        return (
          <div>
            <strong>Navigated to:</strong> {update.url}
          </div>
        )
      case 'step':
        return (
          <div>
            <strong>
              Step {update.current} of {update.total}
            </strong>
          </div>
        )
      case 'action':
        return (
          <div>
            <strong>Action:</strong>
            <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto mt-2">
              {JSON.stringify(update.action, null, 2)}
            </pre>
          </div>
        )
      case 'actionResult':
        return (
          <div>
            <strong>Result:</strong> {update.result}
            {update.error && <div className="text-red-500">{update.error}</div>}
          </div>
        )
      case 'complete':
        return (
          <div>
            <strong>Task Completed</strong>
            <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto mt-2">
              {JSON.stringify(update.actionsTaken, null, 2)}
            </pre>
          </div>
        )
      default:
        return <div>{JSON.stringify(update)}</div>
    }
  }

  const TaskSummary = () => {
    const mainPath = url
      ? (() => {
          try {
            const parsedUrl = new URL(
              url.startsWith('http') ? url : `https://${url}`
            )
            return parsedUrl.hostname
          } catch (error) {
            return 'Invalid URL'
          }
        })()
      : 'No URL'

    return (
      <div className="flex items-center justify-between w-full h-full overflow-hidden">
        <span>Task Details</span>
        <span className="text-sm text-muted-foreground">
          {title || 'Unnamed'} -
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted">{mainPath}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{url || 'No URL'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
    )
  }

  const getStepIcon = (type: AiManagerUpdate['type']) => {
    switch (type) {
      case 'navigation':
        return <Navigation className="h-4 w-4" />
      case 'action':
      case 'actionResult':
        return <MousePointerClick className="h-4 w-4" />
      case 'step':
        return <Keyboard className="h-4 w-4" />
      case 'debugUrl':
        return <FileSearch className="h-4 w-4" />
      case 'start':
        return <Play className="h-4 w-4" />
      case 'complete':
      case 'finished':
      case 'maxStepsReached':
      case 'stopped':
        return <Square className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  useEffect(() => {
    if (task?.updates) {
      const latestUpdate = task.updates[task.updates.length - 1]
      if (latestUpdate) {
        switch (latestUpdate.type) {
          case 'debugUrl':
            toast.success('Connected to Hosted Browser', {
              description:
                'The AI manager is now connected to a hosted browser.'
            })
            break
          case 'complete':
          case 'finished':
            toast.success('Task Completed', {
              description: 'The AI manager has finished the task.'
            })
            break
        }
      }
    }
  }, [task?.updates])

  return (
    <FlowProvider>
      <div className="flex h-screen">
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full border-t border-l border-border"
        >
          <ResizablePanel
            defaultSize={3}
            collapsedSize={3}
            collapsible={true}
            minSize={3}
            maxSize={7}
            onCollapse={() => {
              setIsNavCollapsed(true)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true
              )}`
            }}
            onResize={() => {
              setIsNavCollapsed(false)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false
              )}`
            }}
            className={cn(
              'flex flex-col',
              isNavCollapsed &&
                'min-w-[50px] transition-all duration-30 ease-in-out'
            )}
          >
            <Sidebar isCollapsed={isNavCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20}>
            <ChatDisplay />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30}>
            <Tabs defaultValue="design" className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4 bg-background h-[52px]">
                <h2 className="text-lg font-semibold">Manage Tasks</h2>
                <TabsList className="ml-auto">
                  <TabsTrigger
                    value="design"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    Design View
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <TabsContent value="design" className="flex-grow overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="px-4 py-2 flex-shrink-0">
                    <Accordion
                      type="single"
                      collapsible
                      value={isAccordionOpen ? 'item-1' : ''}
                      onValueChange={value =>
                        setIsAccordionOpen(value === 'item-1')
                      }
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <TaskSummary />
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 mb-8 p-4">
                            <Input
                              type="url"
                              placeholder="Enter URL"
                              value={url}
                              onChange={handleUrlChange}
                              onBlur={handleUrlBlur}
                              required
                              disabled={isRunning}
                            />
                            <Textarea
                              placeholder="Describe the task"
                              value={description}
                              onChange={handleDescriptionChange}
                              onBlur={handleDescriptionBlur}
                              required
                              disabled={isRunning}
                            />
                            <Input
                              type="text"
                              placeholder="Task Title"
                              value={title}
                              onChange={handleTitleChange}
                              required
                              disabled={isRunning}
                            />
                            <Button
                              type="button"
                              onClick={handleAction}
                              className="w-full"
                              disabled={
                                !url ||
                                !title ||
                                !description ||
                                generateTitleMutation.isLoading
                              }
                            >
                              {isRunning ? (
                                <>
                                  <Square className="mr-2 h-4 w-4" /> Stop Task
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" /> Start Task
                                </>
                              )}
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <ScrollArea className="flex-grow px-4 py-2">
                    <div className="space-y-4">
                      {task?.updates ? (
                        renderGroupedUpdates(task.updates)
                      ) : (
                        <div className="text-muted-foreground">
                          No task selected or no updates available
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent
                value="settings"
                className="flex-grow overflow-hidden"
              >
                <div className="flex-grow overflow-auto  flex flex-col">
                  <div className="sticky top-0 bg-background z-10"></div>
                  <SettingsComponent />
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 bg-background h-[52px]">
                    <h2 className="text-lg font-semibold">Task Preview</h2>
                  </div>
                  <Separator />
                  <div className="flex-grow p-4 bg-muted">
                    <div className="bg-white w-full h-full rounded-lg overflow-hidden relative">
                      {iframeUrl ? (
                        <iframe
                          src={iframeUrl}
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
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 bg-background h-[52px]">
                    <h2 className="text-lg font-semibold">Task Logs</h2>
                  </div>
                  <Separator />
                  <ScrollArea className="flex-grow p-4">
                    {task ? (
                      <ul className="space-y-4">
                        {task.updates.map((update, index) => (
                          <li key={index} className="bg-muted p-4 rounded-md">
                            <strong>{update.type}:</strong>
                            {renderUpdateContent(update)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-muted-foreground">
                        No logs available
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </FlowProvider>
  )
}
