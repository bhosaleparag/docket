"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";
import { useProject } from "@/context/ProjectContext";

const ACCEPTED = ".pdf,.txt,.md";

export default function DocumentsPageClient({ project: initialProject }) {
  const context = useProject();
  const project = initialProject || context?.project;

  const router = useRouter();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Local docs state — seeded from project context, updated after upload
  const [docs, setDocs] = useState(project?.docs || []);

  // Keep local docs in sync if the context project changes (e.g. after router.refresh)
  useEffect(() => {
    if (project?.docs) {
      setDocs(project.docs);
    }
  }, [project?.docs]);

  async function fetchDocs() {
    if (!project?.id) return;
    try {
      const res = await fetch(`/api/projects/${project.id}`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data?.project?.docs || []);
      }
    } catch {
      // silently fail — the router.refresh() fallback will handle it
    }
  }

  async function upload(fileList) {
    const files = Array.from(fileList);
    if (files.length === 0 || !project?.id) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch(`/api/projects/${project.id}/documents`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to upload documents");
      }

      // Immediately fetch fresh docs list so UI updates without hard refresh
      await fetchDocs();
      // Also refresh server components in the background for layout sync
      router.refresh();
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files);
  }

  return (
    <div className="p-8 max-w-2xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`border border-dashed rounded-lg p-8 flex flex-col items-center text-center mb-8 cursor-pointer transition-colors ${
          dragOver ? "border-forest bg-forest/5" : "border-line hover:border-black/30"
        }`}
      >
        <Upload size={20} className="text-forest mb-3" />
        <p className="text-sm font-medium mb-1">
          {uploading ? "Uploading…" : "Drop files here, or click to browse"}
        </p>
        <p className="text-muted text-xs">PDF, TXT, or Markdown — added to {project?.name} only</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>

      {uploadError && (
        <p className="text-red-500 text-sm mb-4">{uploadError}</p>
      )}

      <div className="border border-line rounded-lg divide-y">
        {docs.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted">No documents uploaded yet.</p>
        )}
        {docs.map((d) => (
          <div key={d.id || d.name} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-muted" />
              <p className="text-sm font-medium">{d.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
