"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, PlugZap, Save } from "lucide-react";
import { Header } from "@/components/header";
import {
  getApiSettings,
  saveApiSettings,
  type ApiSettings,
} from "@/lib/local-progress";

type TestState = "idle" | "loading" | "success" | "error";

export default function SettingsPage() {
  const [settings, setSettings] = useState<ApiSettings>({
    provider: "openai",
    model: "gpt-4o-mini",
    apiKey: "",
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState>("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    const stored = getApiSettings();
    setSettings(stored);
  }, []);

  const handleSave = () => {
    saveApiSettings(settings);
    setSavedAt(new Date().toLocaleString());
  };

  const handleTestConnection = async () => {
    if (!settings.apiKey.trim()) {
      setTestState("error");
      setTestMessage("API Key를 먼저 입력해주세요.");
      return;
    }

    setTestState("loading");
    setTestMessage("연결 테스트 중...");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
          temperature: 0,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setTestState("error");
        setTestMessage(
          `연결 실패 (${response.status}): ${errorText.slice(0, 120)}`
        );
        return;
      }

      setTestState("success");
      setTestMessage("연결 성공. 이 모델을 사용할 수 있습니다.");
    } catch (error) {
      setTestState("error");
      setTestMessage(
        error instanceof Error ? `연결 실패: ${error.message}` : "연결 실패"
      );
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
            API 모델/키는 브라우저 로컬 저장소(localStorage)에만 저장됩니다.
          </p>

          <div className="mt-6 grid gap-5">
            <div>
              <label
                htmlFor="provider"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Provider
              </label>
              <input
                id="provider"
                value="OpenAI"
                disabled
                className="h-11 w-full rounded-[16px] border border-input bg-muted px-4 text-sm text-muted-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Model
              </label>
              <input
                id="model"
                value={settings.model}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, model: event.target.value }))
                }
                placeholder="gpt-4o-mini"
                className="h-11 w-full rounded-[16px] border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
              />
            </div>

            <div>
              <label
                htmlFor="api-key"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={settings.apiKey}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, apiKey: event.target.value }))
                }
                placeholder="sk-..."
                className="h-11 w-full rounded-[16px] border border-input bg-background px-4 text-sm outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
              />
            </div>
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

          {savedAt && (
            <p className="mt-4 text-xs text-muted-foreground">
              마지막 저장: {savedAt}
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
    </div>
  );
}

