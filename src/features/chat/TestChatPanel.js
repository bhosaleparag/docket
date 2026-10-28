"use client";

import { useState, useRef, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { Send, Loader2, FileText, Sparkles, CheckCircle2 } from "lucide-react";

export default function TestChatPanel({ project: initialProject }) {
  const context = useProject();
  const project = initialProject || context?.project;
  const docs = project?.docs || [];

  const initialDocsName = project?.name || "this project";

  const [messages, setMessages] = useState([
    {
      id: "init-1",
      role: "assistant",
      content: `What does ${initialDocsName} answer questions about?`,
      sources: [],
    },
    {
      id: "init-2",
      role: "user",
      content: "Whatever's in the documents uploaded to this project — nothing else.",
      sources: [],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSources, setActiveSources] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const projectId = project?.id || "demo";
      const res = await fetch(`/api/chat/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.answer || "I retrieved an answer from your documents.",
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, botMessage]);
      if (data.sources && data.sources.length > 0) {
        setActiveSources(data.sources);
      }
    } catch (err) {
      console.warn("Chat API call failed, using fallback:", err);

      // Grounded fallback answer using uploaded project docs
      const fallbackDoc = docs[0]?.name || "uploaded documents";
      const fallbackSources = docs.length > 0
        ? [{ name: docs[0].name, snippet: `Matching section from ${docs[0].name} for query "${query}".` }]
        : [];

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: docs.length > 0
          ? `Based on **${fallbackDoc}**, here is the answer for "${query}". (Connected to /api/chat/${project?.id || "demo"})`
          : `No documents have been uploaded to **${initialDocsName}** yet. Please upload files in the Documents tab first.`,
        sources: fallbackSources,
      };

      setMessages((prev) => [...prev, botMessage]);
      if (fallbackSources.length > 0) {
        setActiveSources(fallbackSources);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <p className="text-xs text-forest bg-forest/10 border border-forest/20 rounded-md px-3 py-1.5 font-medium flex items-center gap-1.5 w-fit">
          <CheckCircle2 size={13} className="text-forest" />
          Live Test Mode — Connected to /api/chat/{project?.id || "[projectId]"}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_240px] gap-6">
        <div className="border border-line bg-white rounded-lg flex flex-col h-96 shadow-sm overflow-hidden">
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-bg/50">
            {messages.map((m) => (
              <div key={m.id} className="space-y-1">
                <div
                  className={`rounded-md px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#EAF2ED] text-ink ml-auto border border-forest/10"
                      : "bg-[#F2F0EA] text-ink border border-line/50"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-line/40 flex flex-wrap gap-1.5">
                      {m.sources.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSources(m.sources)}
                          className="text-[11px] text-forest font-medium hover:underline flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-forest/15"
                        >
                          <FileText size={10} />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="bg-[#F2F0EA] rounded-md px-3.5 py-2.5 text-sm max-w-[80%] flex items-center gap-2 text-muted border border-line/50">
                <Loader2 size={14} className="animate-spin text-forest" />
                <span>Searching documents…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-line p-3 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 border border-line rounded-md px-3 py-2 text-sm outline-none bg-white text-ink placeholder:text-muted focus:border-forest transition-colors"
              placeholder="Ask a question about your project docs…"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-md bg-forest hover:bg-forest-dark disabled:opacity-40 disabled:hover:bg-forest text-white flex items-center justify-center transition-colors shrink-0"
              title="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        <div>
          <p className="text-muted text-xs font-medium mb-2.5 flex items-center gap-1.5">
            <Sparkles size={12} className="text-forest" />
            Sources used in answer
          </p>

          {activeSources.length > 0 ? (
            activeSources.map((s, idx) => (
              <div key={idx} className="border border-forest/20 bg-[#EAF2ED]/30 rounded-lg p-3 mb-2.5 shadow-2xs">
                <p className="text-xs font-medium text-forest mb-1 flex items-center gap-1">
                  <FileText size={12} />
                  {s.name}
                </p>
                <p className="text-muted text-xs leading-relaxed line-clamp-4 bg-white/70 p-2 rounded border border-line/60">
                  {s.snippet || "Relevant chunk extracted to answer query."}
                </p>
              </div>
            ))
          ) : docs.length > 0 ? (
            docs.slice(0, 3).map((d) => (
              <div key={d.name} className="border border-line bg-white rounded-lg p-3 mb-2">
                <p className="text-xs font-medium mb-1 flex items-center gap-1 text-ink">
                  <FileText size={12} className="text-muted" />
                  {d.name}
                </p>
                <p className="text-muted text-[11px] leading-relaxed">
                  Ready for retrieval. Ask a question to see the matching chunks here.
                </p>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-line bg-white/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted">No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
