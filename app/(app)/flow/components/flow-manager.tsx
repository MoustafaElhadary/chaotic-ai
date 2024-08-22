import { StepList } from "@/components/StepList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, WebhookIcon } from "lucide-react";
import { FlowFormValues, useFlowContext } from "./FlowContext";

interface FlowManagerProps {}

export function FlowManager({}: FlowManagerProps) {
  const { form } = useFlowContext();

  const onSubmit = (values: FlowFormValues) => {
    console.log(values);
    // Handle form submission
  };

  const FlowSummary = () => {
    const name = form.watch("name");
    const url = form.watch("url");
    const mainPath = url ? new URL(url).hostname : "No URL";

    return (
      <div className="flex items-center justify-between w-full">
        <span>Flow Details</span>
        <span className="text-sm text-muted-foreground">
          {name || "Unnamed"} -
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="underline decoration-dotted">{mainPath}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{url || "No URL"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
    );
  };

  return (
    <Tabs defaultValue="design" className="h-full flex flex-col">
      <div className="flex items-center px-4 py-2">
        <h1 className="text-xl font-bold">Manage Flow</h1>
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

      <TabsContent
        value="design"
        className="flex-1 overflow-hidden flex flex-col"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-4 py-2">
              <FlowSummary />
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-4 pb-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 border-b border-zinc-200 pb-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} placeholder="Enter test name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <WebhookIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="https://example.com"
                              className="pl-8"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter test description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <StepList />
          </div>
        </ScrollArea>
        <div className="p-4 space-y-2 border-t">
          <Button className="w-full" onClick={form.handleSubmit(onSubmit)}>
            <Play className="mr-2 h-4 w-4" /> Run
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="">
        {/* TODO: will setup later */}
        <div className="p-4 flex-1 flex flex-col">
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-zinc-500">
            Manage the flow settings here.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
