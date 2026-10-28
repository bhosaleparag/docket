import generateChat from "@/lib/generateChat";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import generateEmbeddings from "@/lib/embeddings";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams?.projectId;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const userMessage = body.message?.trim();
    const history = Array.isArray(body.history) ? body.history : [];

    if (!userMessage) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // 1. Fetch Project Details & Documents Collection
    let project = null;
    let documentsList = [];

    // 2. Perform Vector Similarity Search in Supabase (pgvector)
    let retrievedChunks = [];
    let sources = [];

    try {
      // Generate embedding for user query
      const embeddings = await generateEmbeddings([userMessage]);
      const queryEmbedding = embeddings?.[0];

      if (queryEmbedding) {
        // Query Supabase vector DB via match_chunks RPC function
        const { data: matchedChunks, error: rpcError } = await supabase.rpc("match_chunks", {
          query_embedding: queryEmbedding,
          filter_project_id: String(projectId),
          match_threshold: 0.15,
          match_count: 2,
        });

        if (rpcError) {
          console.warn("Supabase vector match RPC warning:", rpcError.message);
        } else if (matchedChunks && matchedChunks.length > 0) {
          retrievedChunks = matchedChunks;
          sources = matchedChunks.map((chunk) => ({
            name: chunk.document_name || "Document",
            snippet: chunk.content,
            similarity: chunk.similarity,
          }));
        }
      }
    } catch (embeddingError) {
      console.warn("Vector search error (falling back to standard prompt):", embeddingError);
    }

    // 3. Fallback sources if RPC returns no results but documents exist
    if (sources.length === 0 && documentsList.length > 0) {
      sources = documentsList.map((d) => ({
        name: d.name,
        snippet: `Document stored in collection: ${d.name}`,
      }));
    }

    // 4. Construct System Prompt for the Assistant
    const docNames = documentsList.map((d) => d.name).join(", ");
    const contextText = retrievedChunks.length > 0
      ? retrievedChunks
        .map(
          (c, i) =>
            `[Source ${i + 1}: ${c.document_name || "Document"}]\n${c.content}`
        )
        .join("\n\n")
      : "";

    // 4. Build system prompt from dedicated module
    const systemPrompt = buildSystemPrompt({ project, docNames, contextText });

    // 5. Prepare Chat Messages Array (Filter out old system messages)
    const filteredHistory = history.filter((m) => m.role !== "system");
    const messages = [
      { role: "system", content: systemPrompt },
      ...filteredHistory,
      { role: "user", content: userMessage },
    ];

    // 6. Generate Response with LLM
    const answer = await generateChat(messages);

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process chat message" },
      { status: 500 }
    );
  }
}
