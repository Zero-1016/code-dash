"use client";

import { useEffect, useState } from "react";

let hasPlayedPageEntryAnimation = false;

export function usePageEntryAnimation() {
  const [shouldAnimate] = useState(() => !hasPlayedPageEntryAnimation);

  useEffect(() => {
    hasPlayedPageEntryAnimation = true;
  }, []);

  return shouldAnimate;
}
