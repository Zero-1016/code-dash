"use client";

import { useEffect, useState } from "react";
import {
  getLanguagePreference,
  subscribeToProgressUpdates,
  type AppLanguage,
} from "@/lib/local-progress";
import { getLocaleCopy } from "@/lib/i18n";

export function useAppLanguage() {
  const [language, setLanguage] = useState<AppLanguage>(() =>
    getLanguagePreference()
  );

  useEffect(() => {
    const sync = () => {
      setLanguage((prev) => {
        const next = getLanguagePreference();
        return prev === next ? prev : next;
      });
    };
    return subscribeToProgressUpdates(sync);
  }, []);

  return { language, copy: getLocaleCopy(language) };
}
