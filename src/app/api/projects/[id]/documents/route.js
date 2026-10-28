import { NextResponse } from "next/server";
import { extractText } from "unpdf";
import { chunkText } from "@/utils/ollama";
import generateEmbeddings from "@/lib/embeddings";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    let totalChunks = 0;

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      // 1. Extract text

      let text = "";

      if (file.name.toLowerCase().endsWith(".pdf")) {
        const buffer = await file.arrayBuffer();
        const result = await extractText(new Uint8Array(buffer));
        text = result.text;
      } else if (file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".md")) {
        text = await file.text();
      } else {
        continue;
      }

      // 2. Create document

      const { data: document, error: documentError } = await supabase.from("documents").insert({ project_id: id, name: file.name }).select().single();
      if (documentError) {
        throw documentError;
      }

      // 3. Chunk
      const chunks = await chunkText(text);
      if (!chunks.length) {
        continue;
      }

      // 4. Generate embeddings
      const embeddings = await generateEmbeddings(chunks);

      if (embeddings.length !== chunks.length) {
        throw new Error(
          `Embedding count mismatch for ${file.name}`
        );
      }

      // 5. Prepare DB rows
      const chunkData = chunks.map((content, index) => ({
        project_id: id,
        document_id: document.id,
        content,
        embedding: embeddings[index],
      }));

      // 6. Insert chunks
      const { error: chunkError } = await supabase.from("chunks").insert(chunkData);

      if (chunkError) {
        throw chunkError;
      }

      totalChunks += chunks.length;
    }

    return NextResponse.json({
      status: "accepted",
      files: files.length,
      chunks: totalChunks,
    });

  } catch (error) {
    console.error("Document ingestion error:", error);

    return NextResponse.json(
      {
        error: "Failed to process documents",
        message:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}