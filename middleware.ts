import { NextResponse, type NextRequest } from "next/server";
import {
  resolveLanguageFromAcceptLanguage,
  resolveLanguageFromCountryCode,
} from "@/lib/country-language";

const COUNTRY_COOKIE = "codedash.country";
const LANGUAGE_COOKIE = "codedash.lang-default";

function readCountryCode(req: NextRequest): string {
  const headerCandidates = [
    req.headers.get("x-vercel-ip-country"),
    req.headers.get("cf-ipcountry"),
    req.headers.get("cloudfront-viewer-country"),
    req.headers.get("x-country-code"),
  ];

  for (const candidate of headerCandidates) {
    const normalized = (candidate ?? "").trim().toUpperCase();
    if (normalized) {
      return normalized;
    }
  }

  return "US";
}

export function middleware(req: NextRequest) {
  const countryCode = readCountryCode(req);
  const fallbackLanguage = resolveLanguageFromAcceptLanguage(
    req.headers.get("accept-language")
  );
  const preferredLanguage =
    countryCode === "US"
      ? fallbackLanguage
      : resolveLanguageFromCountryCode(countryCode);

  const response = NextResponse.next();
  response.cookies.set(COUNTRY_COOKIE, countryCode, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(LANGUAGE_COOKIE, preferredLanguage, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
