"use server";

import ollama from "ollama";

const EMBEDDING_MODEL = "nomic-embed-text:latest";

async function generateEmbeddings(texts) {
  const response = await ollama.embed({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.embeddings;
}

export default generateEmbeddings;