"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, ArrowUpRight, Loader2 } from "lucide-react";

export default function ChatWidget({ projectId = "demo", projectName = "Docket" }) {
  const [messages, setMessages] = useState([
    {
      id: "w-1",
      role: "assistant",
      content: `Hello! I can answer questions about ${projectName} based on our documentation. What would you like to know?`,
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`/api/chat/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history: messages }),
      });

      if (!res.ok) throw new Error("Network response error");

      const data = await res.json();

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.answer || `Here is what I found regarding "${query}".`,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn("ChatWidget API call fallback:", err);

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: `I couldn't find relevant information in the documentation for **${projectName}**.`,
        sources: [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="bg-forest px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-white" />
          <p className="text-white text-sm font-medium">Ask about {projectName}</p>
        </div>
        <button className="text-white/70 hover:text-white transition-colors" title="Close">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-bg/30">
        {messages.map((m) => (
          <div key={m.id} className="space-y-1.5">
            <div
              className={`rounded-lg px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed ${
                m.role === "user"
                  ? "bg-[#EAF2ED] text-ink ml-auto border border-forest/10"
                  : "bg-[#F2F0EA] text-ink border border-line/40"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>

              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 pt-1.5 border-t border-line/40 space-y-1">
                  {m.sources.map((s, idx) => (
                    <p key={idx} className="text-forest text-xs font-medium flex items-center gap-1">
                      Source: {s.name} <ArrowUpRight size={11} />
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="bg-[#F2F0EA] rounded-lg px-3.5 py-2.5 text-sm max-w-[85%] flex items-center gap-2 text-muted border border-line/40">
            <Loader2 size={14} className="animate-spin text-forest" />
            <span>Thinking…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="border-t border-line p-3 flex items-center gap-2 shrink-0 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 border border-line rounded-md px-3 py-2 text-sm outline-none bg-white text-ink placeholder:text-muted focus:border-forest transition-colors"
          placeholder="Type your question…"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-md bg-forest hover:bg-forest-dark disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors"
          title="Send"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
