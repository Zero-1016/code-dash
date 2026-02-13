"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, PlugZap, Save } from "lucide-react";
import { Header } from "@/components/header";
import { getApiSettings, saveApiSettings, type ApiSettings } from "@/lib/local-progress";
import { getDefaultAIConfig, type AIProvider } from "@/lib/ai-config";

type TestState = "idle" | "loading" | "success" | "error";

const PROVIDERS: Array<{ id: AIProvider; label: string }> = [
  { id: "claude", label: "Anthropic Claude" },
  { id: "gpt", label: "OpenAI GPT" },
  { id: "gemini", label: "Google Gemini" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<ApiSettings>(getDefaultAIConfig());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    setSettings(getApiSettings());
  }, []);

  const active = useMemo(() => settings.provider, [settings.provider]);

  const handleSave = () => {
    saveApiSettings(settings);
    setSavedAt(new Date().toLocaleString());
  };

  const handleTestConnection = async () => {
    const key = settings.apiKeys[active]?.trim();
    if (!key) {
      setTestState("error");
      setTestMessage(`${active.toUpperCase()} API Key를 먼저 입력해주세요.`);
      return;
    }

    setTestState("loading");
    setTestMessage("연결 테스트 중...");

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
        setTestMessage(`연결 실패 (${response.status}): ${errorText.slice(0, 120)}`);
        return;
      }

      setTestState("success");
      setTestMessage("연결 성공. 현재 선택한 모델로 사용할 수 있습니다.");
    } catch (error) {
      setTestState("error");
      setTestMessage(error instanceof Error ? `연결 실패: ${error.message}` : "연결 실패");
    } finally {
      clearTimeout(timeout);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[16px] px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="rounded-[28px] border border-border/60 bg-card p-6 shadow-sm sm:p-8"
        >
          <h1 className="text-2xl font-bold text-foreground">My Page</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Provider, model, token, API key는 브라우저 localStorage에만 저장됩니다.
          </p>

          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="provider" className="mb-2 block text-sm font-semibold text-foreground">
                Active Provider
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

            {PROVIDERS.map((provider) => {
              const isActive = provider.id === active;
              return (
                <div
                  key={provider.id}
                  className={`rounded-[20px] border p-4 ${
                    isActive ? "border-[#3182F6]/40 bg-[#3182F6]/5" : "border-border/60 bg-background"
                  }`}
                >
                  <h3 className="mb-3 text-sm font-bold text-foreground">{provider.label}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor={`model-${provider.id}`}
                        className="mb-1 block text-xs font-semibold text-muted-foreground"
                      >
                        Model
                      </label>
                      <input
                        id={`model-${provider.id}`}
                        value={settings.models[provider.id]}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            models: { ...prev.models, [provider.id]: event.target.value },
                          }))
                        }
                        placeholder={
                          provider.id === "claude"
                            ? "claude-3-5-sonnet-20241022"
                            : provider.id === "gpt"
                            ? "gpt-4o"
                            : "gemini-pro"
                        }
                        className="h-10 w-full rounded-[14px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`tokens-${provider.id}`}
                        className="mb-1 block text-xs font-semibold text-muted-foreground"
                      >
                        Max Tokens
                      </label>
                      <input
                        id={`tokens-${provider.id}`}
                        type="number"
                        min={1}
                        max={16000}
                        value={settings.maxTokens[provider.id]}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            maxTokens: {
                              ...prev.maxTokens,
                              [provider.id]: Math.max(1, Number(event.target.value) || 1),
                            },
                          }))
                        }
                        className="h-10 w-full rounded-[14px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`api-key-${provider.id}`}
                        className="mb-1 block text-xs font-semibold text-muted-foreground"
                      >
                        API Key
                      </label>
                      <input
                        id={`api-key-${provider.id}`}
                        type="password"
                        value={settings.apiKeys[provider.id]}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            apiKeys: { ...prev.apiKeys, [provider.id]: event.target.value },
                          }))
                        }
                        placeholder={
                          provider.id === "claude"
                            ? "sk-ant-..."
                            : provider.id === "gpt"
                            ? "sk-..."
                            : "AIza..."
                        }
                        className="h-10 w-full rounded-[14px] border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#3182F6] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#3182F6]/20 transition-all hover:bg-[#2870d8]"
            >
              <Save className="h-4 w-4" />
              Save
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
              Test Connection
            </button>
          </div>

          {savedAt && <p className="mt-4 text-xs text-muted-foreground">마지막 저장: {savedAt}</p>}

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
    </div>
  );
}

