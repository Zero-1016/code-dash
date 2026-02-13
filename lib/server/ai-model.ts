import type { LanguageModel } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ConcreteAIProvider } from "@/lib/ai-config";

export function getLanguageModel(
  provider: ConcreteAIProvider,
  modelId: string,
  apiKey: string
): LanguageModel {
  if (provider === "claude") {
    const anthropic = createAnthropic({ apiKey });
    return anthropic(modelId);
  }

  if (provider === "gpt") {
    const openai = createOpenAI({ apiKey });
    return openai(modelId);
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google(modelId);
}

