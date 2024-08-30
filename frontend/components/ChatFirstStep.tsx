import { useState, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

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

export default function Component() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Handle send message
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="font-heading text-pretty text-center text-[22px] font-semibold tracking-tighter text-gray-900 sm:text-[30px] md:text-[36px] mb-2 max-w-2xl">
          What can I help you ship today?
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Generate UI, ask questions, debug, execute code, and much more.
        </p>
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              placeholder="Ask v0 a question..."
              className="min-h-[60px] w-full bg-transparent placeholder:text-zinc-900 resize-none px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              name="message"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <div className="absolute right-4 top-[13px] sm:right-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={input === ''}
                    className="bg-transparent shadow-none text-zinc-950 rounded-full hover:bg-zinc-200"
                  >
                    <IconArrowElbow />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-zinc-200"
            >
              Generate a SaaS pricing calculator
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-zinc-200"
            >
              How can I schedule cron jobs?
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-zinc-200"
            >
              A function to flatten nested arrays
            </Badge>
          </div>
        </div>
      </main>
    </div>
  )
}
