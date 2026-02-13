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

    for (const provider of providerCandidates(config)) {
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
        console.error(`AI connection test failed for ${provider}:`, error);
      }
    }

    return NextResponse.json(
      { ok: false, message: "No valid provider/key pair was available." },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI connection test error:", error);
    return NextResponse.json({ ok: false, message: "Connection test failed." }, { status: 500 });
  }
}
