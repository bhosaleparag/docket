"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import ProjectCard from "./ProjectCard";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectsPageClient({ initialProjects }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(project) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't create the project.");
      }

      setShowCreate(false);
      // Bust the server cache then navigate to force a fresh server-side fetch
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="border-b border-line px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">Projects</h1>
          <p className="text-muted text-sm mt-1">
            Each project is one bot, built from its own documents.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-forest text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={15} /> New project
        </button>
      </div>

      <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {initialProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
        <button
          onClick={() => setShowCreate(true)}
          className="border border-dashed border-line rounded-lg p-5 flex flex-col items-center justify-center gap-1.5 text-sm text-muted hover:border-black/30 transition-colors"
        >
          <Plus size={16} /> Create project
        </button>
      </div>

      {showCreate && (
        <CreateProjectModal
          onClose={() => {
            setShowCreate(false);
            setError("");
          }}
          onCreate={handleCreate}
          submitting={submitting}
          error={error}
        />
      )}
    </main>
  );
}
