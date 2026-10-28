import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export async function chunkText(texts) {
  const text = Array.isArray(texts) ? texts.join("") : texts;
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
  return splitter.splitText(text);
}