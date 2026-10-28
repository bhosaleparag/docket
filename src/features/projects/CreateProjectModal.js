"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export default function CreateProjectModal({ onClose, onCreate, submitting, error }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError("Give your project a name.");
      return;
    }
    setLocalError("");
    onCreate({ name: name.trim(), description: description.trim() });
  }

  const displayError = localError || error;

  return (
    <Modal
      title="New project"
      subtitle="One project = one bot, scoped to its own documents."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="project-name" className="text-xs font-medium block mb-1.5">
          Project name
        </label>
        <input
          id="project-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setLocalError("");
          }}
          placeholder="e.g. Support Docs Bot"
          className="w-full border border-line rounded-md px-3 py-2 text-sm mb-1 outline-none focus:ring-2 focus:ring-forest/30"
          autoFocus
        />
        <p className={`text-xs mb-3 ${displayError ? "text-red-600" : "invisible"}`}>
          {displayError || "placeholder"}
        </p>

        <label htmlFor="project-description" className="text-xs font-medium block mb-1.5">
          Description <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="project-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this bot for, and where will it live?"
          rows={3}
          className="w-full border border-line rounded-md px-3 py-2 text-sm mb-6 outline-none resize-none focus:ring-2 focus:ring-forest/30"
        />

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="text-sm text-muted hover:text-ink px-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-forest text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
