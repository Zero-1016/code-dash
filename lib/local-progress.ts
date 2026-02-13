"use client";

import { getDefaultAIConfig, type AIConfigPayload } from "@/lib/ai-config";
import { problems } from "@/lib/problems";

export interface ApiSettings extends AIConfigPayload {}

export interface SolveRecord {
  problemId: string;
  solvedAt: string;
  passed: number;
  total: number;
  success: boolean;
  elapsedSeconds?: number;
}

interface DraftRecord {
  code: string;
  updatedAt: string;
}

type DraftMap = Record<string, DraftRecord>;
type ActivityMap = Record<string, number>;

const STORAGE_KEYS = {
  settings: "codedash.settings.v1",
  sessionApiKeys: "codedash.session.api-keys.v1",
  language: "codedash.language.v1",
  drafts: "codedash.drafts.v1",
  solves: "codedash.solves.v1",
  activity: "codedash.activity.v1",
} as const;

const DEFAULT_SETTINGS: ApiSettings = getDefaultAIConfig();

const STORAGE_EVENT = "codedash:storage-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

type StorageScope = "local" | "session";

function getStorage(scope: StorageScope): Storage | null {
  if (!isBrowser()) {
    return null;
  }
  return scope === "session" ? window.sessionStorage : window.localStorage;
}

function safeRead<T>(key: string, fallback: T, scope: StorageScope = "local"): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const storage = getStorage(scope);
    if (!storage) {
      return fallback;
    }
    const raw = storage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T, scope: StorageScope = "local") {
  if (!isBrowser()) {
    return;
  }

  try {
    const storage = getStorage(scope);
    if (!storage) {
      return;
    }
    storage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // noop
  }
}

export function subscribeToProgressUpdates(listener: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_EVENT, onStorage);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_EVENT, onStorage);
  };
}

export function getApiSettings(): ApiSettings {
  const raw = safeRead<unknown>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const sessionApiKeys = safeRead<ApiSettings["apiKeys"]>(
    STORAGE_KEYS.sessionApiKeys,
    DEFAULT_SETTINGS.apiKeys,
    "session"
  );

  if (raw && typeof raw === "object") {
    const candidate = raw as Partial<ApiSettings> & {
      model?: string;
      apiKey?: string;
      provider?: string;
    };

    // Backward compatibility for old settings shape.
    if (typeof candidate.model === "string" || typeof candidate.apiKey === "string") {
      return {
        ...DEFAULT_SETTINGS,
        provider:
          candidate.provider === "claude" ||
          candidate.provider === "gpt" ||
          candidate.provider === "gemini"
            ? candidate.provider
            : "gpt",
        models: {
          ...DEFAULT_SETTINGS.models,
          gpt: candidate.model || DEFAULT_SETTINGS.models.gpt,
        },
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          ...sessionApiKeys,
        },
        maxTokens: {
          ...DEFAULT_SETTINGS.maxTokens,
        },
      };
    }

    return {
      ...DEFAULT_SETTINGS,
      provider:
        candidate.provider === "claude" ||
        candidate.provider === "gpt" ||
        candidate.provider === "gemini"
          ? candidate.provider
          : DEFAULT_SETTINGS.provider,
      models: {
        ...DEFAULT_SETTINGS.models,
        ...(candidate.models || {}),
      },
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        ...sessionApiKeys,
      },
      maxTokens: {
        ...DEFAULT_SETTINGS.maxTokens,
        ...(candidate.maxTokens || {}),
      },
    };
  }

  return DEFAULT_SETTINGS;
}

export function saveApiSettings(settings: ApiSettings) {
  safeWrite(STORAGE_KEYS.settings, {
    provider: settings.provider,
    models: settings.models,
    maxTokens: settings.maxTokens,
  });
  safeWrite(STORAGE_KEYS.sessionApiKeys, settings.apiKeys, "session");
}

export type AppLanguage = "en" | "ko";

const DEFAULT_LANGUAGE: AppLanguage = "en";

function isAppLanguage(value: unknown): value is AppLanguage {
  return value === "en" || value === "ko";
}

export function getLanguagePreference(): AppLanguage {
  const language = safeRead<unknown>(STORAGE_KEYS.language, DEFAULT_LANGUAGE);
  return isAppLanguage(language) ? language : DEFAULT_LANGUAGE;
}

export function saveLanguagePreference(language: AppLanguage) {
  safeWrite(STORAGE_KEYS.language, language);
}

export function getDraft(problemId: string): DraftRecord | null {
  const drafts = safeRead<DraftMap>(STORAGE_KEYS.drafts, {});
  return drafts[problemId] ?? null;
}

export function saveDraft(problemId: string, code: string) {
  const drafts = safeRead<DraftMap>(STORAGE_KEYS.drafts, {});
  drafts[problemId] = {
    code,
    updatedAt: new Date().toISOString(),
  };
  safeWrite(STORAGE_KEYS.drafts, drafts);
}

export function deleteDraft(problemId: string) {
  const drafts = safeRead<DraftMap>(STORAGE_KEYS.drafts, {});
  if (!drafts[problemId]) {
    return;
  }
  delete drafts[problemId];
  safeWrite(STORAGE_KEYS.drafts, drafts);
}

export function getSolveRecords(): SolveRecord[] {
  return safeRead<SolveRecord[]>(STORAGE_KEYS.solves, []);
}

export function saveSolveRecord(record: SolveRecord) {
  const current = safeRead<SolveRecord[]>(STORAGE_KEYS.solves, []);
  current.unshift(record);
  safeWrite(STORAGE_KEYS.solves, current.slice(0, 1000));
}

export function getSolvedProblemIds(): Set<string> {
  const records = getSolveRecords();
  const solved = records.filter((r) => r.success).map((r) => r.problemId);
  return new Set(solved);
}

export function recordActivity(date = new Date()) {
  const activity = safeRead<ActivityMap>(STORAGE_KEYS.activity, {});
  const key = toDateKey(date);
  activity[key] = (activity[key] ?? 0) + 1;
  safeWrite(STORAGE_KEYS.activity, activity);
}

function toDateKey(value: Date) {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getActivityMap(): ActivityMap {
  return safeRead<ActivityMap>(STORAGE_KEYS.activity, {});
}

export function getCurrentStreak() {
  const activity = getActivityMap();
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = toDateKey(cursor);
    if (!activity[key]) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getHeatmap(days = 84) {
  const activity = getActivityMap();
  const data: Array<{ date: string; count: number }> = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(cursor);
    day.setDate(cursor.getDate() - i);
    const key = toDateKey(day);
    data.push({
      date: key,
      count: activity[key] ?? 0,
    });
  }

  return data;
}

export function getDashboardStats() {
  const solves = getSolveRecords();
  const solvedSet = getSolvedProblemIds();
  const solvedCount = solvedSet.size;
  const successEntries = solves.filter((entry) => entry.success);
  const completion = problems.length
    ? Math.round((solvedCount / problems.length) * 100)
    : 0;

  const avgMinutes = (() => {
    const elapsedTimes = successEntries
      .map((entry) => entry.elapsedSeconds)
      .filter((value): value is number => typeof value === "number" && value > 0);

    if (!elapsedTimes.length) {
      return null;
    }

    const averageSeconds =
      elapsedTimes.reduce((sum, seconds) => sum + seconds, 0) / elapsedTimes.length;
    const roundedMinutes = Math.max(1, Math.round(averageSeconds / 60));

    return roundedMinutes;
  })();

  return {
    solvedCount,
    completion,
    avgMinutes,
  };
}
