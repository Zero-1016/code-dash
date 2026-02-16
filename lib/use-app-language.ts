"use client";

import { useEffect, useState } from "react";
import type { AppLanguage } from "@/lib/app-language";
import {
  getLanguagePreference,
  subscribeToProgressUpdates,
} from "@/lib/local-progress";
import { getLocaleCopy } from "@/lib/i18n";

export function useAppLanguage() {
  const [language, setLanguage] = useState<AppLanguage>("en");

  useEffect(() => {
    const sync = () => {
      setLanguage((prev) => {
        const next = getLanguagePreference();
        return prev === next ? prev : next;
      });
    };
    sync();
    return subscribeToProgressUpdates(sync);
  }, []);

  return { language, copy: getLocaleCopy(language) };
}
