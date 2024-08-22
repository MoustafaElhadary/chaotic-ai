"use server";

import { createOpenAI, openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq("llama3-groq-70b-8192-tool-use-preview");
// const model = openai("gpt-3.5-turbo");

export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    // model: openai("gpt-3.5-turbo"),
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    prompt: question,
  });

  return { text, finishReason, usage };
}

export async function generate(input: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model,
      prompt: input,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
