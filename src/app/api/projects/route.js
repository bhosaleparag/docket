import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: projectsData, error: error } = await supabase
      .from("projects")
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: allDocs } = await supabase.from("documents").select("*");
    const docsByProjectId = (allDocs || []).reduce((acc, doc) => {
      const pid = doc.project_id || doc.projectId;
      if (pid) {
        if (!acc[pid]) acc[pid] = [];
        acc[pid].push(doc);
      }
      return acc;
    }, {});

    const formattedProjects = (projectsData || []).map((p) => ({
      ...p,
      docs: docsByProjectId[p.id] || [],
      createdAt: p.createdAt || p.created_at,
    })).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body?.name || !body.name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: body.name.trim(),
        description: body.description ?? "",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const project = {
      ...data,
      createdAt: data.createdAt || data.created_at,
      docs: data.docs || data.documents || [],
    };

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project" },
      { status: 500 }
    );
  }
}

