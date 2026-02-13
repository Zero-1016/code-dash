"use server";

import { generateText } from "ai";
import { type AIProvider } from "@/lib/ai-config";
import { getLanguageModel } from "@/lib/server/ai-model";

export interface TestConnectionInput {
  provider: AIProvider;
  model: string;
  apiKey: string;
  maxTokens: number;
}

export interface TestConnectionResult {
  ok: boolean;
  provider: AIProvider;
  message: string;
  detail?: string;
  availableModels?: string[];
}

interface GeminiListModelsResponse {
  models?: Array<{
    name?: string;
    supportedGenerationMethods?: string[];
  }>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return "Unknown error";
}

async function listGeminiGenerateContentModels(apiKey: string): Promise<string[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    { method: "GET", cache: "no-store" }
  );

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as GeminiListModelsResponse;
  const candidates = payload.models ?? [];

  return candidates
    .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => (model.name ?? "").replace(/^models\//, ""))
    .filter(Boolean)
    .slice(0, 20);
}

export async function testAiConnectionAction(
  input: TestConnectionInput
): Promise<TestConnectionResult> {
  const provider = input.provider;
  const model = input.model.trim();
  const apiKey = input.apiKey.trim();

  if (!apiKey) {
    return {
      ok: false,
      provider,
      message: `Connection failed for ${provider}.`,
      detail: "API key is required.",
    };
  }

  if (!model) {
    return {
      ok: false,
      provider,
      message: `Connection failed for ${provider}.`,
      detail: "Model is required.",
    };
  }

  try {
    await generateText({
      model: getLanguageModel(provider, model, apiKey),
      prompt: "ping",
      maxOutputTokens: Math.max(1, Math.min(input.maxTokens, 256)),
      temperature: 0,
    });

    return { ok: true, provider, message: "Connection success." };
  } catch (error) {
    const detail = getErrorMessage(error);
    let availableModels: string[] | undefined;

    if (provider === "gemini") {
      try {
        const models = await listGeminiGenerateContentModels(apiKey);
        if (models.length > 0) {
          availableModels = models;
        }
      } catch {
        // noop
      }
    }

    return {
      ok: false,
      provider,
      message: `Connection failed for ${provider}.`,
      detail,
      availableModels,
    };
  }
}
