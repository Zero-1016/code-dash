"use client";

import { useEffect, useState } from "react";
import {
  getLanguagePreference,
  subscribeToProgressUpdates,
  type AppLanguage,
} from "@/lib/local-progress";
import { getLocaleCopy } from "@/lib/i18n";

export function useAppLanguage() {
  const [language, setLanguage] = useState<AppLanguage>("en");

  useEffect(() => {
    const sync = () => setLanguage(getLanguagePreference());
    sync();
    return subscribeToProgressUpdates(sync);
  }, []);

  return { language, copy: getLocaleCopy(language) };
}
