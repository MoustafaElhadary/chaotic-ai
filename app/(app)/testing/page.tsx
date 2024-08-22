"use client";

import EditableTitle from "@/components/EditableTitle";
import { StepList } from "@/components/StepList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebsitePreview } from "@/components/WebsitePreview";
import { readStreamableValue } from "ai/rsc";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { generate } from "./actions";

interface Step {
  id: string;
  description: string;
}

const FlowTester = () => {
  const [url, setUrl] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ id: "1", description: "" }]);
  const [generation, setGeneration] = useState<string>("");

  return (
    <>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Flows</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create New Flow</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex h-screen">
        <div className="w-1/2 p-4 overflow-y-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                <EditableTitle initialTitle="Website Flow Tester" />
              </CardTitle>
              <CardDescription>
                Test your website flows using AI-powered tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL to Test</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyz.com/page/123"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Design Your Test Flow</CardTitle>
                  <CardDescription>
                    Add and rearrange steps to define your test flow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StepList />
                  <Button
                    onClick={() =>
                      setSteps([
                        ...steps,
                        { id: Date.now().toString(), description: "" },
                      ])
                    }
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Add Step
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter>
              <Button
                className="flex items-center space-x-2"
                onClick={async () => {
                  const { output } = await generate("Why is the sky blue?");

                  for await (const delta of readStreamableValue(output)) {
                    setGeneration(
                      (currentGeneration) => `${currentGeneration}${delta}`
                    );
                  }
                }}
              >
                <PlayIcon className="w-4 h-4" />
                <span>RUN</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <WebsitePreview />
      </div>
    </>
  );
};

export default FlowTester;
