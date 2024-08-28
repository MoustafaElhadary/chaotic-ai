// 'use client'

// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle
// } from '@/components/ui/resizable'
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger
// } from '@/components/ui/accordion'
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent
// } from '@/components/ui/tooltip'
// import { trpc } from '@/lib/trpc/client'
// import { debounce } from 'lodash'
// import { ChevronDown, ChevronUp, Play, Square } from 'lucide-react'
// import React, { useCallback, useState } from 'react'
// import { toast } from 'sonner'
// import {
//   AiManagerUpdate,
//   Task,
//   useAiManagerSSEStream
// } from './useAiManagerSSEStream'

// export default function Component() {
//   const [url, setUrl] = useState('')
//   const [description, setDescription] = useState('')
//   const [title, setTitle] = useState('')
//   const [expandedRows, setExpandedRows] = useState<number[]>([])
//   const [lastProcessedUrl, setLastProcessedUrl] = useState('')
//   const [lastProcessedDescription, setLastProcessedDescription] = useState('')
//   const [isAccordionOpen, setIsAccordionOpen] = useState(true)

//   const {
//     tasks,
//     isRunning,
//     currentTaskId,
//     iframeUrl,
//     startAiManager,
//     stopAiManager,
//     setTasks
//   } = useAiManagerSSEStream()

//   const generateTitleMutation = trpc.taskActions.generateTitle.useMutation({
//     onSuccess: data => {
//       if (data.title && data.title !== title) {
//         if (!title) {
//           setTitle(data.title)
//           toast.success('Title automatically set', {
//             description: data.title
//           })
//         } else {
//           toast('New task title suggestion', {
//             description: data.title,
//             action: {
//               label: 'Accept',
//               onClick: () => setTitle(data.title)
//             }
//           })
//         }
//       }
//     }
//   })

//   const improveDescriptionMutation =
//     trpc.taskActions.improveDescription.useMutation({
//       onSuccess: data => {
//         if (
//           data.improvedDescription &&
//           data.improvedDescription !== description
//         ) {
//           toast('Description improved', {
//             description: 'Review the updated description',
//             action: {
//               label: 'Accept',
//               onClick: () => setDescription(data.improvedDescription)
//             }
//           })
//         }
//       }
//     })

//   const validateUrlMutation = trpc.taskActions.validateUrl.useMutation({
//     onSuccess: data => {
//       if (!data.isValid && data.correctedUrl && data.correctedUrl !== url) {
//         toast('Invalid URL', {
//           description: `Suggested URL: ${data.correctedUrl}`,
//           action: {
//             label: 'Accept',
//             onClick: () => data.correctedUrl && setUrl(data.correctedUrl)
//           }
//         })
//       } else if (data.isValid) {
//         toast.success('Valid URL')
//       }
//     }
//   })

//   const debouncedGenerateTitle = useCallback(
//     debounce((url: string, description: string, currentTitle: string) => {
//       if (url && description) {
//         generateTitleMutation.mutate({ url, description, title: currentTitle })
//       }
//     }, 100),
//     [generateTitleMutation]
//   )

//   const debouncedImproveDescription = useCallback(
//     debounce((description: string) => {
//       if (description) {
//         improveDescriptionMutation.mutate({ description })
//       }
//     }, 100),
//     [improveDescriptionMutation]
//   )

//   const debouncedValidateUrl = useCallback(
//     debounce((url: string) => {
//       if (url) {
//         validateUrlMutation.mutate({ url })
//       }
//     }, 100),
//     [validateUrlMutation]
//   )

//   const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUrl(e.target.value)
//   }

//   const handleUrlBlur = () => {
//     if (url !== lastProcessedUrl) {
//       debouncedValidateUrl(url)
//       setLastProcessedUrl(url)
//       if (description && description !== lastProcessedDescription) {
//         debouncedGenerateTitle(url, description, title)
//         setLastProcessedDescription(description)
//       }
//     }
//   }

//   const handleDescriptionChange = (
//     e: React.ChangeEvent<HTMLTextAreaElement>
//   ) => {
//     setDescription(e.target.value)
//   }

//   const handleDescriptionBlur = () => {
//     if (description !== lastProcessedDescription) {
//       debouncedImproveDescription(description)
//       setLastProcessedDescription(description)
//       if (url && url !== lastProcessedUrl) {
//         debouncedGenerateTitle(url, description, title)
//         setLastProcessedUrl(url)
//       }
//     }
//   }

//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setTitle(e.target.value)
//   }

//   const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault()
//     if (isRunning) {
//       stopAiManager(currentTaskId!)
//     } else {
//       const newTask: Task = {
//         id: Date.now(),
//         url,
//         title,
//         description,
//         status: 'running',
//         updates: []
//       }
//       setTasks(prevTasks => [...prevTasks, newTask])
//       startAiManager(newTask.id, url, title, description)
//       setIsAccordionOpen(false)
//     }
//   }

//   const toggleRowExpansion = (taskId: number) => {
//     setExpandedRows(prev =>
//       prev.includes(taskId)
//         ? prev.filter(id => id !== taskId)
//         : [...prev, taskId]
//     )
//   }

//   const renderUpdateContent = (update: AiManagerUpdate) => {
//     switch (update.type) {
//       case 'action':
//       case 'actionResult':
//         return (
//           <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto mt-2">
//             {JSON.stringify(update.action, null, 2)}
//           </pre>
//         )
//       case 'complete':
//         return (
//           <pre className="bg-muted-foreground/10 p-2 rounded overflow-auto mt-2">
//             {JSON.stringify(update.actionsTaken, null, 2)}
//           </pre>
//         )
//       default:
//         return JSON.stringify(update)
//     }
//   }

//   const TaskSummary = () => {
//     const mainPath = url
//       ? (() => {
//           try {
//             const parsedUrl = new URL(
//               url.startsWith('http') ? url : `https://${url}`
//             )
//             return parsedUrl.hostname
//           } catch (error) {
//             return 'Invalid URL'
//           }
//         })()
//       : 'No URL'

//     return (
//       <div className="flex items-center justify-between w-full h-full overflow-hidden">
//         <span>Task Details</span>
//         <span className="text-sm text-muted-foreground">
//           {title || 'Unnamed'} -
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <span className="underline decoration-dotted">{mainPath}</span>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>{url || 'No URL'}</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </span>
//       </div>
//     )
//   }

//   return (
//     <div className="flex h-screen">
//       <ResizablePanelGroup
//         direction="horizontal"
//         className="w-full border-t border-l border-border"
//       >
//         <ResizablePanel defaultSize={25} minSize={20}>
//           <div className="h-full overflow-auto p-4">
//             <h2 className="text-2xl font-bold mb-4">Task List</h2>
//             {/* Add content for the new left section here */}
//           </div>
//         </ResizablePanel>
//         <ResizableHandle withHandle />
//         <ResizablePanel defaultSize={40} minSize={30}>
//           <div className="h-full overflow-auto px-4">
//             <Accordion
//               type="single"
//               collapsible
//               value={isAccordionOpen ? 'item-1' : ''}
//               onValueChange={value => setIsAccordionOpen(value === 'item-1')}
//             >
//               <AccordionItem value="item-1">
//                 <AccordionTrigger>
//                   <TaskSummary />
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <div className="space-y-4 mb-8 p-4">
//                     <Input
//                       type="url"
//                       placeholder="Enter URL"
//                       value={url}
//                       onChange={handleUrlChange}
//                       onBlur={handleUrlBlur}
//                       required
//                       disabled={isRunning}
//                     />
//                     <Textarea
//                       placeholder="Describe the task"
//                       value={description}
//                       onChange={handleDescriptionChange}
//                       onBlur={handleDescriptionBlur}
//                       required
//                       disabled={isRunning}
//                     />
//                     <Input
//                       type="text"
//                       placeholder="Task Title"
//                       value={title}
//                       onChange={handleTitleChange}
//                       required
//                       disabled={isRunning}
//                     />
//                     <Button
//                       type="button"
//                       onClick={handleAction}
//                       className="w-full"
//                       disabled={
//                         !url ||
//                         !title ||
//                         !description ||
//                         generateTitleMutation.isLoading
//                       }
//                     >
//                       {isRunning ? (
//                         <>
//                           <Square className="mr-2 h-4 w-4" /> Stop Task
//                         </>
//                       ) : (
//                         <>
//                           <Play className="mr-2 h-4 w-4" /> Start Task
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Title</TableHead>
//                   <TableHead>URL</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {tasks.map(task => (
//                   <React.Fragment key={task.id}>
//                     <TableRow>
//                       <TableCell>{task.title}</TableCell>
//                       <TableCell>{task.url}</TableCell>
//                       <TableCell>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                             task.status === 'running'
//                               ? 'bg-yellow-200 text-yellow-800'
//                               : task.status === 'completed'
//                               ? 'bg-green-200 text-green-800'
//                               : 'bg-red-200 text-red-800'
//                           }`}
//                         >
//                           {task.status}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => toggleRowExpansion(task.id)}
//                         >
//                           {expandedRows.includes(task.id) ? (
//                             <ChevronUp className="h-4 w-4" />
//                           ) : (
//                             <ChevronDown className="h-4 w-4" />
//                           )}
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                     {expandedRows.includes(task.id) && (
//                       <TableRow>
//                         <TableCell colSpan={4}>
//                           <div className="p-4 bg-muted rounded-md">
//                             <h4 className="font-semibold mb-2">Description:</h4>
//                             <p>{task.description}</p>
//                             {task.debugUrl && (
//                               <div className="mt-4">
//                                 <h4 className="font-semibold mb-2">
//                                   Debug URL:
//                                 </h4>
//                                 <a
//                                   href={task.debugUrl}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-500 hover:underline"
//                                 >
//                                   {task.debugUrl}
//                                 </a>
//                               </div>
//                             )}
//                             <h4 className="font-semibold mt-4 mb-2">
//                               Updates:
//                             </h4>
//                             <ul className="list-disc pl-5">
//                               {task.updates.map((update, index) => (
//                                 <li key={index} className="mb-4">
//                                   <strong>{update.type}:</strong>
//                                   {renderUpdateContent(update)}
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </ResizablePanel>
//         <ResizableHandle withHandle />
//         <ResizablePanel defaultSize={35} minSize={30}>
//           <ResizablePanelGroup direction="vertical">
//             <ResizablePanel defaultSize={50}>
//               <div className="h-full p-4 bg-muted border-b border-border">
//                 <div className="bg-white w-full h-full rounded-lg overflow-hidden relative">
//                   {iframeUrl ? (
//                     <iframe
//                       src={iframeUrl}
//                       allow="clipboard-read; clipboard-write"
//                       width="100%"
//                       height="100%"
//                       allowFullScreen
//                       className="absolute inset-0 w-full h-full border rounded-lg"
//                       style={{ pointerEvents: 'none' }}
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-muted-foreground">
//                       No active task
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </ResizablePanel>
//             <ResizableHandle withHandle />
//             <ResizablePanel defaultSize={50}>
//               <div className="h-full p-4 bg-white overflow-auto">
//                 <h2 className="text-2xl font-bold mb-4">Task Details</h2>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Property</TableHead>
//                       <TableHead>Value</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>Example</TableCell>
//                       <TableCell>Data</TableCell>
//                     </TableRow>
//                     {/* Add more rows as needed */}
//                   </TableBody>
//                 </Table>
//               </div>
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   )
// }

//export simple component
export default function Archive() {
  return <div>Archive</div>
}
