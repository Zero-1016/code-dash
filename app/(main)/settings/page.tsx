"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, PlugZap, Save } from "lucide-react";
import {
  getApiSettings,
  getLanguagePreference,
  saveApiSettings,
  saveLanguagePreference,
  type ApiSettings,
  type AppLanguage,
} from "@/lib/local-progress";
import { getDefaultAIConfig, type AIProvider } from "@/lib/ai-config";
import { getLocaleCopy } from "@/lib/i18n";
import { usePageEntryAnimation } from "@/lib/use-page-entry-animation";

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
  gemini: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"],
};

export default function SettingsPage() {
  const shouldAnimateOnMount = usePageEntryAnimation();
  const [settings, setSettings] = useState<ApiSettings>(getDefaultAIConfig());
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>("en");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMessage, setTestMessage] = useState("");
  const copy = getLocaleCopy(selectedLanguage);

  useEffect(() => {
    setSettings(getApiSettings());
    setSelectedLanguage(getLanguagePreference());
  }, []);

  const active = useMemo(() => settings.provider, [settings.provider]);
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
    saveApiSettings(settings);
    saveLanguagePreference(selectedLanguage);
    setSavedAt(new Date().toLocaleString());
  };

  const handleTestConnection = async () => {
    const key = settings.apiKeys[active]?.trim();
    if (!key) {
      setTestState("error");
      setTestMessage(`${active.toUpperCase()} ${copy.settings.keyRequired}`);
      return;
    }

    setTestState("loading");
    setTestMessage(copy.settings.testingConnection);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/ai-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aiConfig: settings,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setTestState("error");
        setTestMessage(`${copy.settings.connectionFailed} (${response.status}): ${errorText.slice(0, 120)}`);
        return;
      }

      setTestState("success");
      setTestMessage(copy.settings.connectionSuccess);
    } catch (error) {
      setTestState("error");
      setTestMessage(
        error instanceof Error
          ? `${copy.settings.connectionFailed}: ${error.message}`
          : copy.settings.connectionFailed
      );
    } finally {
      clearTimeout(timeout);
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
              <label htmlFor="language" className="mb-2 block text-sm font-semibold text-foreground">
                {copy.settings.languageTitle}
              </label>
              <p className="mb-2 text-xs text-muted-foreground">{copy.settings.languageDescription}</p>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(event) => {
                  const nextLanguage = event.target.value as AppLanguage;
                  setSelectedLanguage(nextLanguage);
                  saveLanguagePreference(nextLanguage);
                }}
                className="h-11 w-full rounded-[16px] border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
              >
                <option value="en">{copy.settings.languageEnglish}</option>
                <option value="ko">{copy.settings.languageKorean}</option>
              </select>
            </div>

            <div>
              <label htmlFor="provider" className="mb-2 block text-sm font-semibold text-foreground">
                {copy.settings.provider}
              </label>
              <select
                id="provider"
                value={settings.provider}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    provider: event.target.value as AIProvider,
                  }))
                }
                className="h-11 w-full rounded-[16px] border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
              >
                {PROVIDERS.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.label}
                  </option>
                ))}
              </select>
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
                  <select
                    id={`model-${active}`}
                    value={settings.models[active]}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        models: { ...prev.models, [active]: event.target.value },
                      }))
                    }
                    className="h-10 w-full rounded-[14px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                  >
                    {MODEL_OPTIONS[active].map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
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
                      setSettings((prev) => ({
                        ...prev,
                        maxTokens: {
                          ...prev.maxTokens,
                          [active]: Math.max(1, Number(event.target.value) || 1),
                        },
                      }))
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
                      setSettings((prev) => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, [active]: event.target.value },
                      }))
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
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#3182F6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#3182F6]/20 transition-all hover:bg-[#2870d8]"
            >
              <Save className="h-4 w-4" />
              {copy.settings.save}
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testState === "loading"}
              className="inline-flex items-center gap-2 rounded-[18px] border border-[#3182F6]/30 bg-[#3182F6]/5 px-5 py-2.5 text-sm font-semibold text-[#3182F6] transition-colors hover:bg-[#3182F6]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {testState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlugZap className="h-4 w-4" />
              )}
              {copy.settings.testConnection}
            </button>
          </div>

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
