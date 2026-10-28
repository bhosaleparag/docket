"use client";

import { useProject } from "@/context/ProjectContext";
import EmbedSnippet from "./EmbedSnippet";

export default function EmbedPageClient({ project: initialProject }) {
  const context = useProject();
  const project = initialProject || context?.project;

  if (!project) return null;

  return (
    <div className="p-8 max-w-2xl">
      <EmbedSnippet projectId={project.id} />
      <p className="text-muted text-xs mt-3">
        The widget loads asynchronously and won&apos;t affect your page speed. This snippet is
        tied to {project.name} — it will never surface documents from your other projects.
      </p>
    </div>
  );
}
