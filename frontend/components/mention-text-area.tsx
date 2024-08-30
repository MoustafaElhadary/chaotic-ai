"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AutosizeTextarea,
  AutosizeTextAreaProps,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MentionTextareaProps extends AutosizeTextAreaProps {
  options?: string[];
}

const MentionTextarea = React.forwardRef<
  HTMLTextAreaElement,
  MentionTextareaProps
>(({ options = [], className, ...props }, ref) => {
  const [value, setValue] = useState("");
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [showMentions, setShowMentions] = useState(false);
  const textareaRef = useRef<AutosizeTextAreaRef | null>(null);

  useEffect(() => {
    if (showMentions) {
      const textarea = textareaRef.current;
      const end = textarea?.textArea.selectionEnd;
      const textBeforeCursor = value.slice(0, end);
      const lastAtSymbol = textBeforeCursor.lastIndexOf("@");
      if (lastAtSymbol !== -1) {
        setMentionSearch(textBeforeCursor.slice(lastAtSymbol + 1));
        setMentionIndex(lastAtSymbol);
      }
    }
  }, [showMentions, value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const lastChar = e.target.value[e.target.selectionEnd - 1];
    setShowMentions(lastChar === "@");
  };

  const handleMention = (option: string) => {
    const before = value.slice(0, mentionIndex);
    const after = value.slice(textareaRef.current?.textArea.selectionEnd ?? 0);
    setValue(`${before}@${option} ${after}`);
    setShowMentions(false);
    textareaRef.current?.textArea.focus();
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <Popover open={showMentions}>
      <PopoverTrigger asChild>
        <AutosizeTextarea
          ref={(textareaElement) => {
            textareaRef.current = textareaElement;
            if (typeof ref === "function") {
              ref(textareaElement?.textArea ?? null);
            } else if (ref) {
              ref.current = textareaElement?.textArea ?? null;
            }
          }}
          value={value}
          onChange={handleChange}
          placeholder="Type your message here. Use @ to mention someone."
          className="min-h-[100px]"
          {...props}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search names..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => handleMention(option)}
                >
                  {option}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

MentionTextarea.displayName = "MentionTextarea";

export default MentionTextarea;
