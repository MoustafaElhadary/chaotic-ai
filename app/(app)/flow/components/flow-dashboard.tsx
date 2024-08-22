"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebsitePreview } from "@/components/WebsitePreview";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FlowManager } from "./flow-manager";
import { ChatDisplay } from "./chat-display";
import { Sidebar } from "./sidebar";
import { FlowProvider, useFlowContext } from "./FlowContext";
import Confetti from "react-confetti";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface FlowDashboardProps {
  defaultLayout: number[] | undefined;
}

function FlowDashboardContent({
  defaultLayout = [5, 30, 30, 35],
}: FlowDashboardProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const { showConfetti, showAlert, setShowAlert, alertText } = useFlowContext();

  return (
    <div className="relative min-h-screen max-h-screen flex flex-col">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      {showAlert && (
        <Alert className="absolute top-4 left-4 right-4 z-50">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{alertText}</AlertDescription>
          <Button className="mt-2" onClick={() => setShowAlert(false)}>
            Close
          </Button>
        </Alert>
      )}
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
              sizes
            )}`;
          }}
          className="flex-grow"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={4}
            collapsible={true}
            minSize={5}
            maxSize={10}
            onCollapse={() => {
              setIsNavCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true
              )}`;
            }}
            onResize={() => {
              setIsNavCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false
              )}`;
            }}
            className={cn(
              "flex flex-col",
              isNavCollapsed &&
                "min-w-[50px] transition-all duration-30 ease-in-out"
            )}
          >
            <Sidebar isCollapsed={isNavCollapsed} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <FlowManager />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={defaultLayout[2]}
            collapsedSize={15}
            collapsible={true}
            minSize={15}
            maxSize={40}
            onCollapse={() => {
              setIsChatCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true
              )}`;
            }}
            onResize={() => {
              setIsChatCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false
              )}`;
            }}
            className={cn(
              "flex flex-col",
              isChatCollapsed &&
                "min-w-[50px] transition-all duration-30 ease-in-out"
            )}
          >
            <WebsitePreview />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[3]} minSize={20}>
            <ChatDisplay />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
}

export function FlowDashboard(props: FlowDashboardProps) {
  return (
    <FlowProvider>
      <FlowDashboardContent {...props} />
    </FlowProvider>
  );
}
