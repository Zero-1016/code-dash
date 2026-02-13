export type AIProvider = "claude" | "gpt" | "gemini";
export type ConcreteAIProvider = AIProvider;

export interface AIConfigPayload {
  provider: AIProvider;
  models: Record<ConcreteAIProvider, string>;
  apiKeys: Record<ConcreteAIProvider, string>;
  maxTokens: Record<ConcreteAIProvider, number>;
}

export interface ResolvedAIConfig extends AIConfigPayload {}

const DEFAULT_MODELS: Record<ConcreteAIProvider, string> = {
  claude: "claude-3-5-sonnet-20241022",
  gpt: "gpt-4o",
  gemini: "gemini-pro",
};

export function getDefaultAIConfig(): ResolvedAIConfig {
  return {
    provider: "claude",
    models: { ...DEFAULT_MODELS },
    apiKeys: {
      claude: "",
      gpt: "",
      gemini: "",
    },
    maxTokens: {
      claude: 1024,
      gpt: 1000,
      gemini: 1024,
    },
  };
}

export function resolveAIConfig(payload?: Partial<AIConfigPayload>): ResolvedAIConfig {
  const provider = payload?.provider ?? "claude";

  return {
    provider: provider === "claude" || provider === "gpt" || provider === "gemini" ? provider : "claude",
    models: {
      claude: payload?.models?.claude || DEFAULT_MODELS.claude,
      gpt: payload?.models?.gpt || DEFAULT_MODELS.gpt,
      gemini: payload?.models?.gemini || DEFAULT_MODELS.gemini,
    },
    apiKeys: {
      claude: payload?.apiKeys?.claude || "",
      gpt: payload?.apiKeys?.gpt || "",
      gemini: payload?.apiKeys?.gemini || "",
    },
    maxTokens: {
      claude: Math.max(1, Math.floor(payload?.maxTokens?.claude ?? 1024)),
      gpt: Math.max(1, Math.floor(payload?.maxTokens?.gpt ?? 1000)),
      gemini: Math.max(1, Math.floor(payload?.maxTokens?.gemini ?? 1024)),
    },
  };
}

export function providerCandidates(config: ResolvedAIConfig): ConcreteAIProvider[] {
  return [config.provider];
}
