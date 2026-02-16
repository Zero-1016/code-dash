import type { AppLanguage } from "@/lib/app-language";

export function resolveLanguageFromCountryCode(
  countryCode: string | null | undefined
): AppLanguage {
  const normalized = (countryCode ?? "").trim().toUpperCase();

  if (normalized === "KR") {
    return "ko";
  }

  return "en";
}

export function resolveLanguageFromAcceptLanguage(
  acceptLanguage: string | null | undefined
): AppLanguage {
  const normalized = (acceptLanguage ?? "").trim().toLowerCase();
  if (!normalized) {
    return "en";
  }

  const primary = normalized.split(",")[0]?.trim() ?? "";
  if (primary.startsWith("ko")) {
    return "ko";
  }

  return "en";
}
