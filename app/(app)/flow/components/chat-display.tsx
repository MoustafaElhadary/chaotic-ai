import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { UserButton } from "@clerk/nextjs";
import { Settings, Bot } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFlowContext } from "./FlowContext";
const CodeBlock = ({ code }: { code: string }) => (
  <pre className="bg-muted p-2 rounded-md">
    <code>
      {code.split("\n").map((line, index) => (
        <span key={index}>
          {line}
          {index < code.split("\n").length - 1 && <br />}
        </span>
      ))}
    </code>
  </pre>
);

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  component?: React.ReactNode;
};

export function ChatDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { setShowConfetti, setShowAlert, setAlertText } = useFlowContext();

  const scrollToBottom = (smooth = false) => {
    if (chatContainerRef.current?.lastElementChild) {
      chatContainerRef.current.lastElementChild.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom(true); // Scroll on initial load
  }, []);

  useEffect(() => {
    scrollToBottom(true); // Scroll when messages change
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: input,
        sender: "user" as const,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");

      // Smart chat responses
      let aiResponse: Message;
      switch (input.toLowerCase()) {
        case "hi":
          aiResponse = {
            id: messages.length + 2,
            text: "Hello! Here's some information for you:",
            sender: "ai",
            timestamp: new Date(),
            component: (
              <Collapsible className="w-full mt-2">
                <CollapsibleTrigger className="w-full text-left px-4 py-2 bg-muted rounded-md">
                  XYZ Information
                </CollapsibleTrigger>
                <CollapsibleContent
                  className="mt-2 overflow-hidden"
                  style={{ width: "100%", maxWidth: "60%" }}
                >
                  <div className="max-w-full overflow-x-auto">
                    <CodeBlock
                      code={`function example() {\n  console.log("Hello, World!");\n}`}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ),
          };
          break;
        case "confetti":
          setShowConfetti(true);
          aiResponse = {
            id: messages.length + 2,
            text: "Confetti time! 🎉",
            sender: "ai",
            timestamp: new Date(),
          };
          break;
        case "alert":
          setShowAlert(true);
          setAlertText("This is a custom alert message from the chat!");
          aiResponse = {
            id: messages.length + 2,
            text: "I've triggered an alert for you.",
            sender: "ai",
            timestamp: new Date(),
          };
          break;
        default:
          aiResponse = {
            id: messages.length + 2,
            text: "I'm not sure how to respond to that.",
            sender: "ai",
            timestamp: new Date(),
          };
      }
      // Update messages
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 bg-background">
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-start space-x-2 max-w-[calc(100%-40px)]`}
              >
                <Avatar
                  className={`flex-shrink-0 w-8 h-8 ${
                    message.sender === "user" ? "ml-2" : "mr-2"
                  } mt-1`}
                >
                  {message.sender === "user" ? (
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
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } break-words`}
                  >
                    {message.text}
                  </div>
                  {message.component && (
                    <div className="mt-2 w-full overflow-hidden">
                      {message.component}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground mt-1">
                    {format(message.timestamp, "HH:mm")}
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
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex space-x-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
