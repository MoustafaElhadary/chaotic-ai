'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { useImperativeHandle } from 'react'

interface UseAutosizeTextAreaProps {
  textAreaRef: HTMLTextAreaElement | null
  minHeight?: number
  maxHeight?: number
  triggerAutoSize: string
}

export const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0
}: UseAutosizeTextAreaProps) => {
  const adjustHeight = React.useCallback(() => {
    const offsetBorder = 2
    if (textAreaRef) {
      textAreaRef.style.minHeight = `${minHeight + offsetBorder}px`
      if (maxHeight > minHeight) {
        textAreaRef.style.maxHeight = `${maxHeight}px`
      }

      // Set initial height to minHeight
      textAreaRef.style.height = `${minHeight + offsetBorder}px`

      // Only adjust height if content exceeds minHeight
      const scrollHeight = textAreaRef.scrollHeight
      if (scrollHeight > minHeight + offsetBorder) {
        textAreaRef.style.height = `${Math.min(scrollHeight, maxHeight)}px`
      }
    }
  }, [textAreaRef, minHeight, maxHeight])

  React.useEffect(() => {
    adjustHeight()
  }, [adjustHeight, triggerAutoSize])

  return adjustHeight
}

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement
  maxHeight: number
  minHeight: number
}

export type AutosizeTextAreaProps = {
  maxHeight?: number
  minHeight?: number
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = Number.MAX_SAFE_INTEGER,
      minHeight = 12,
      className,
      onChange,
      value,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null)
    const [triggerAutoSize, setTriggerAutoSize] = React.useState('')

    const adjustHeight = useAutosizeTextArea({
      textAreaRef: textAreaRef.current,
      triggerAutoSize: triggerAutoSize,
      maxHeight,
      minHeight
    })

    React.useEffect(() => {
      if (textAreaRef.current) {
        adjustHeight()
      }
    }, [adjustHeight])

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight
    }))

    React.useEffect(() => {
      setTriggerAutoSize(value as string)
    }, [props?.defaultValue, value])

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-10 h-10',
          className
        )}
        onChange={e => {
          setTriggerAutoSize(e.target.value)
          onChange?.(e)
        }}
      />
    )
  }
)
AutosizeTextarea.displayName = 'AutosizeTextarea'
