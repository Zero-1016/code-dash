import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import {
  providerCandidates,
  resolveAIConfig,
  type ConcreteAIProvider,
  type AIConfigPayload,
} from "@/lib/ai-config";
import { getLanguageModel } from "@/lib/server/ai-model";

interface AiTestRequest {
  aiConfig?: Partial<AIConfigPayload>;
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

async function runProviderTest(
  provider: ConcreteAIProvider,
  model: string,
  apiKey: string,
  maxTokens: number
) {
  await generateText({
    model: getLanguageModel(provider, model, apiKey),
    prompt: "ping",
    maxOutputTokens: Math.max(1, Math.min(maxTokens, 256)),
    temperature: 0,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: AiTestRequest = await req.json();
    const config = resolveAIConfig(body.aiConfig);
    const attemptedProviders: ConcreteAIProvider[] = [];
    let lastErrorMessage: string | null = null;
    let lastFailedProvider: ConcreteAIProvider | null = null;

    for (const provider of providerCandidates(config)) {
      attemptedProviders.push(provider);
      const apiKey = config.apiKeys[provider]?.trim();
      if (!apiKey) {
        continue;
      }

      try {
        await runProviderTest(
          provider,
          config.models[provider],
          apiKey,
          config.maxTokens[provider]
        );
        return NextResponse.json({ ok: true, provider });
      } catch (error) {
        lastFailedProvider = provider;
        lastErrorMessage = getErrorMessage(error);
        console.error(`AI connection test failed for ${provider}:`, error);
      }
    }

    if (lastFailedProvider && lastErrorMessage) {
      return NextResponse.json(
        {
          ok: false,
          provider: lastFailedProvider,
          message: `Connection failed for ${lastFailedProvider}.`,
          detail: lastErrorMessage,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "No API key was provided for the selected provider.",
        providers: attemptedProviders,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI connection test error:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Connection test failed.",
        detail: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
