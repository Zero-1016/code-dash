"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronDown, Loader2, PlugZap, RotateCcw, Save } from "lucide-react";
import {
  getApiSettings,
  saveApiSettings,
  type ApiSettings,
} from "@/lib/local-progress";
import { getDefaultAIConfig, type AIProvider } from "@/lib/ai-config";
import { useAppLanguage } from "@/lib/use-app-language";
import { usePageEntryAnimation } from "@/lib/use-page-entry-animation";
import { testAiConnectionAction } from "./actions";

type TestState = "idle" | "loading" | "success" | "error";

const PROVIDERS: Array<{ id: AIProvider; label: string }> = [
  { id: "claude", label: "Anthropic Claude" },
  { id: "gpt", label: "OpenAI GPT" },
  { id: "gemini", label: "Google Gemini" },
];

const MODEL_OPTIONS: Record<AIProvider, string[]> = {
  claude: [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
  ],
  gpt: ["gpt-4o", "gpt-4o-mini", "gpt-4.1-mini"],
  gemini: [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-exp-image-generation",
  ],
};

const PROVIDER_HELP: Record<AIProvider, { url: string; keyHint: string }> = {
  claude: {
    url: "https://console.anthropic.com/settings/keys",
    keyHint: "sk-ant-...",
  },
  gpt: {
    url: "https://platform.openai.com/api-keys",
    keyHint: "sk-...",
  },
  gemini: {
    url: "https://aistudio.google.com/app/apikey",
    keyHint: "AIza...",
  },
};

export default function SettingsPage() {
  const shouldAnimateOnMount = usePageEntryAnimation();
  const [settings, setSettings] = useState<ApiSettings>(getDefaultAIConfig());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMessage, setTestMessage] = useState("");
  const [lastSuccessfulSignature, setLastSuccessfulSignature] = useState<string | null>(null);
  const { copy } = useAppLanguage();

  useEffect(() => {
    setSettings(getApiSettings());
  }, []);

  const active = useMemo(() => settings.provider, [settings.provider]);
  const activeModel = settings.models[active]?.trim();
  const activeApiKey = settings.apiKeys[active]?.trim();
  const currentConnectionSignature = useMemo(
    () =>
      JSON.stringify({
        provider: active,
        model: settings.models[active] ?? "",
        apiKey: settings.apiKeys[active] ?? "",
        maxTokens: settings.maxTokens[active] ?? 0,
      }),
    [active, settings.apiKeys, settings.maxTokens, settings.models]
  );
  const canTestConnection = Boolean(activeModel && activeApiKey);
  const canSave =
    canTestConnection &&
    testState === "success" &&
    lastSuccessfulSignature === currentConnectionSignature;
  const backLinkMotion = shouldAnimateOnMount
    ? {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {};
  const sectionMotion = shouldAnimateOnMount
    ? {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, delay: 0.05 },
      }
    : {};

  const handleSave = () => {
    if (!canSave) {
      setTestState("error");
      if (!activeModel) {
        setTestMessage(copy.settings.saveBlockedNoModel);
      } else {
        setTestMessage(copy.settings.saveRequiresTest);
      }
      return;
    }

    saveApiSettings(settings);
    setSavedAt(new Date().toLocaleString());
  };

  const handleResetApiKey = () => {
    const nextSettings: ApiSettings = {
      ...settings,
      apiKeys: {
        ...settings.apiKeys,
        [active]: "",
      },
    };
    setSettings(nextSettings);
    saveApiSettings(nextSettings);
    setSavedAt(new Date().toLocaleString());
    setTestState("idle");
    setTestMessage("");
    setLastSuccessfulSignature(null);
  };

  const handleTestConnection = async () => {
    const key = settings.apiKeys[active]?.trim();
    const model = settings.models[active]?.trim();
    if (!key || !model) {
      setTestState("error");
      setTestMessage(!model ? copy.settings.saveBlockedNoModel : `${active.toUpperCase()} ${copy.settings.keyRequired}`);
      return;
    }

    setTestState("loading");
    setTestMessage(copy.settings.testingConnection);

    try {
      const payload = await testAiConnectionAction({
        provider: active,
        model,
        apiKey: key,
        maxTokens: settings.maxTokens[active],
      });

      if (!payload.ok) {
        const serverMessage =
          payload.detail?.trim() || payload.message?.trim() || "Unknown error";
        const availableModels = payload.availableModels ?? [];
        const modelHint =
          availableModels.length > 0
            ? ` ${copy.settings.model}: ${availableModels.slice(0, 5).join(", ")}`
            : "";
        setTestState("error");
        setTestMessage(
          `${copy.settings.connectionFailed}: ${serverMessage.slice(0, 180)}${modelHint}`
        );
        return;
      }

      setTestState("success");
      setTestMessage(copy.settings.connectionSuccess);
      setLastSuccessfulSignature(currentConnectionSignature);
    } catch (error) {
      setTestState("error");
      setTestMessage(
        error instanceof Error
          ? `${copy.settings.connectionFailed}: ${error.message}`
          : copy.settings.connectionFailed
      );
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          {...backLinkMotion}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[16px] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.settings.backHome}
          </Link>
        </motion.div>

        <motion.section
          {...sectionMotion}
          className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm sm:p-8"
        >
          <h1 className="text-2xl font-bold text-foreground">{copy.settings.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.settings.description}
          </p>

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="provider" className="mb-2 block text-sm font-semibold text-foreground">
                {copy.settings.provider}
              </label>
              <div className="relative">
                <select
                  id="provider"
                  value={settings.provider}
                  onChange={(event) => {
                    setSettings((prev) => ({
                      ...prev,
                      provider: event.target.value as AIProvider,
                    }));
                    setTestState("idle");
                    setTestMessage("");
                    setLastSuccessfulSignature(null);
                  }}
                  className="h-11 w-full appearance-none rounded-[16px] border border-input bg-background px-4 pr-10 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                >
                  {PROVIDERS.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="rounded-[20px] border border-[#3182F6]/40 bg-[#3182F6]/5 p-4">
              <h3 className="mb-3 text-sm font-bold text-foreground">
                {PROVIDERS.find((provider) => provider.id === active)?.label}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`model-${active}`}
                    className="mb-1 block text-xs font-semibold text-muted-foreground"
                  >
                    {copy.settings.model}
                  </label>
                  <div className="relative">
                    <select
                      id={`model-${active}`}
                      value={settings.models[active]}
                      onChange={(event) =>
                        {
                          const nextValue = event.target.value;
                          setSettings((prev) => ({
                            ...prev,
                            models: { ...prev.models, [active]: nextValue },
                          }));
                          setTestState("idle");
                          setTestMessage("");
                          setLastSuccessfulSignature(null);
                        }
                      }
                      className="h-10 w-full appearance-none rounded-[14px] border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                    >
                      <option value="">{copy.settings.modelPlaceholder}</option>
                      {MODEL_OPTIONS[active].map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`tokens-${active}`}
                    className="mb-1 block text-xs font-semibold text-muted-foreground"
                  >
                    {copy.settings.maxTokens}
                  </label>
                  <input
                    id={`tokens-${active}`}
                    type="number"
                    min={1}
                    max={16000}
                    value={settings.maxTokens[active]}
                    onChange={(event) =>
                      {
                        const nextValue = Math.max(1, Number(event.target.value) || 1);
                        setSettings((prev) => ({
                          ...prev,
                          maxTokens: {
                            ...prev.maxTokens,
                            [active]: nextValue,
                          },
                        }));
                        setTestState("idle");
                        setTestMessage("");
                        setLastSuccessfulSignature(null);
                      }
                    }
                    className="h-10 w-full rounded-[14px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`api-key-${active}`}
                    className="mb-1 block text-xs font-semibold text-muted-foreground"
                  >
                    {copy.settings.apiKey}
                  </label>
                  <input
                    id={`api-key-${active}`}
                    type="password"
                    value={settings.apiKeys[active]}
                    onChange={(event) =>
                      {
                        const nextValue = event.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          apiKeys: { ...prev.apiKeys, [active]: nextValue },
                        }));
                        setTestState("idle");
                        setTestMessage("");
                        setLastSuccessfulSignature(null);
                      }
                    }
                    placeholder={
                      active === "claude"
                        ? "sk-ant-..."
                        : active === "gpt"
                        ? "sk-..."
                        : "AIza..."
                    }
                    className="h-10 w-full rounded-[14px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                  />
                  <div className="mt-2 rounded-[12px] border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">{copy.settings.keyHelpLabel}</p>
                    <p className="mt-1">
                      {copy.settings.keyHelpGetLink}:{" "}
                      <a
                        href={PROVIDER_HELP[active].url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#3182F6] underline underline-offset-2 hover:text-[#2870d8]"
                      >
                        {PROVIDER_HELP[active].url}
                      </a>
                    </p>
                    <p className="mt-1">
                      {copy.settings.keyHelpFormat}: {PROVIDER_HELP[active].keyHint}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#3182F6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#3182F6]/20 transition-all hover:bg-[#2870d8] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              <Save className="h-4 w-4" />
              {copy.settings.save}
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testState === "loading" || !canTestConnection}
              className="inline-flex items-center gap-2 rounded-[18px] border border-[#3182F6]/30 bg-[#3182F6]/5 px-5 py-2.5 text-sm font-semibold text-[#3182F6] transition-colors hover:bg-[#3182F6]/10 disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-muted disabled:text-muted-foreground"
            >
              {testState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlugZap className="h-4 w-4" />
              )}
              {copy.settings.testConnection}
            </button>

            <button
              onClick={handleResetApiKey}
              className="inline-flex items-center gap-2 rounded-[18px] border border-border/60 bg-background px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              {copy.settings.resetApiKey}
            </button>
          </div>

          {!canSave && (
            <p className="mt-3 text-xs text-muted-foreground">
              {!activeModel ? copy.settings.saveBlockedNoModel : copy.settings.saveRequiresTest}
            </p>
          )}

          {savedAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              {copy.settings.lastSaved}: {savedAt}
            </p>
          )}

          {testState !== "idle" && (
            <div
              className={`mt-4 rounded-[16px] px-4 py-3 text-sm ${
                testState === "success"
                  ? "bg-[hsl(145,65%,93%)] text-[hsl(145,65%,32%)]"
                  : testState === "error"
                  ? "bg-[hsl(0,72%,93%)] text-[hsl(0,72%,42%)]"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                {testState === "success" && <CheckCircle2 className="h-4 w-4" />}
                <span>{testMessage}</span>
              </div>
            </div>
          )}
        </motion.section>
    </main>
  );
}
