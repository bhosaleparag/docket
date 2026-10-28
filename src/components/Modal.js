"use client";

import { X } from "lucide-react";

export default function Modal({ title, subtitle, onClose, children, widthClass = "max-w-md" }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg border border-line w-full ${widthClass} p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-serif text-xl">{title}</h2>
            {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
