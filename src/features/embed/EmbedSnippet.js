"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

export default function EmbedSnippet({ projectId }) {
  const { copied, copy } = useCopyToClipboard();
  const snippet = `<script\n  src="https://docket.app/widget.js"\n  data-project-id="${projectId}"\n  defer\n></script>`;

  return (
    <div className="bg-ink rounded-lg p-5 relative">
      <button
        onClick={() => copy(snippet)}
        className="absolute top-4 right-4 text-white/50 hover:text-white flex items-center gap-1 text-xs"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
      </button>
      <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-[#EAF2ED]">{snippet}</pre>
    </div>
  );
}
