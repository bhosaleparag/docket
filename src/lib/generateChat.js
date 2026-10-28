"use server";

import ollama from "ollama";

const CHAT_MODEL = "qwen3:8b";

async function generateChat(messages) {
  const response = await ollama.chat({
    model: CHAT_MODEL,
    messages,
  });

  return response.message.content;
}

export default generateChat;