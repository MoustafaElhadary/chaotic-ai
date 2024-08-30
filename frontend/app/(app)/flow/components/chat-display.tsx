import { UserButton } from '@clerk/nextjs'
import { format } from 'date-fns'
import { Bot, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { generateId } from 'ai'
import { useActions, useUIState } from 'ai/rsc'
import { ClientMessage } from '../actions'
import { useFlowContext } from './FlowContext'

const INITIAL_QUESTIONS = [
  'Test the login flow',
  'Test the form submission flow',
  'Test the payment flow'
]

function IconArrowElbow({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z" />
    </svg>
  )
}

export function ChatDisplay() {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useUIState()
  const { continueConversation } = useActions()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { form } = useFlowContext()

  const scrollToBottom = (smooth = false) => {
    if (chatContainerRef.current?.lastElementChild) {
      chatContainerRef.current.lastElementChild.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end',
        inline: 'nearest'
      })
    }
  }

  useEffect(() => {
    scrollToBottom(true) // Scroll on initial load
  }, [])

  useEffect(() => {
    scrollToBottom(true) // Scroll when messages change
  }, [conversation])

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: ClientMessage = {
        id: generateId(),
        role: 'user',
        display: input
      }
      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        newMessage
      ])
      setInput('')

      const message = await continueConversation(input, form.getValues())

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message
      ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleBadgeClick = (text: string) => {
    setInput(text)
    handleSend()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 bg-background h-[52px]">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chat Settings</DialogTitle>
            </DialogHeader>
            {/* Add your settings content here */}
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <ScrollArea className="flex-grow p-4">
        <div ref={chatContainerRef} className="w-full">
          {conversation.map((message: ClientMessage) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div
                className={`flex ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                } items-start space-x-2 max-w-[calc(100%-40px)]`}
              >
                <Avatar
                  className={`flex-shrink-0 w-8 h-8 ${
                    message.role === 'user' ? 'ml-2' : 'mr-2'
                  } mt-1`}
                >
                  {message.role === 'user' ? (
                    <UserButton />
                  ) : (
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col overflow-hidden max-w-full">
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    } break-words`}
                  >
                    {message.display}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {format(new Date(), 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex-shrink-0">
        <div>
          <div className="p-4">
            {conversation.length === 0 && (
              <div className="flex flex-wrap justify-end gap-2 mb-2">
                {INITIAL_QUESTIONS.map((question, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-zinc-200"
                    onClick={() => handleBadgeClick(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Separator />
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            className="relative px-3 py-3"
          >
            <AutosizeTextarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={'Send a message...'}
              className="w-full bg-transparent placeholder:text-zinc-900 resize-none focus-within:outline-none sm:text-sm "
              maxHeight={200}
              minHeight={42}
            />
            <div className="absolute right-4 top-[13px] sm:right-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={input.trim() === ''}
                    className="bg-transparent shadow-none text-zinc-950 rounded-full hover:bg-zinc-200"
                  >
                    <IconArrowElbow />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
