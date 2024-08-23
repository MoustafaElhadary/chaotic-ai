import { UserButton } from '@clerk/nextjs'
import { format } from 'date-fns'
import { Bot, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { generateId } from 'ai'
import { useActions, useUIState } from 'ai/rsc'
import { ClientMessage } from '../actions'
import { useFlowContext } from './FlowContext'

export function ChatDisplay() {
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useUIState()
  const { continueConversation } = useActions()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { setShowConfetti, setShowAlert, setAlertText, form } = useFlowContext()

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
      <ScrollArea className="flex-grow p-4 space-y-8 md:space-y-10">
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
        <Separator />
        <div className="p-4">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            className="flex space-x-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
