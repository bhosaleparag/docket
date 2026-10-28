"use client";

import { useCallback, useState } from "react";

export function useCopyToClipboard(resetDelay = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      } catch {
        // Clipboard API unavailable (e.g. insecure context) — the text is
        // still visible and selectable, so this fails silently.
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}
