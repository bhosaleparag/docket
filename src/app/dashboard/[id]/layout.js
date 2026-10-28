export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import ProjectTabs from "@/features/projects/ProjectTabs";
import { ProjectProvider } from "@/context/ProjectContext";
import { GET } from "@/app/api/projects/[id]/route";

export default async function ProjectLayout({ children, params }) {
  const resolvedParams = await params;
  const res = await GET(null, { params: resolvedParams });
  if (!res.ok) notFound();

  const data = await res.json();
  const project = data?.project;

  if (!project) notFound();

  return (
    <ProjectProvider project={project}>
      <div>
        <div className="px-8 py-5 border-b border-line">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-muted text-xs hover:text-ink mb-3 w-fit"
          >
            <ChevronLeft size={13} /> All projects
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl">{project.name}</h1>
              {project.description && (
                <p className="text-muted text-sm mt-1">{project.description}</p>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-muted shrink-0 mt-1.5">
              <Lock size={11} /> only sees its own documents
            </span>
          </div>
        </div>
        <ProjectTabs projectId={project.id} />
        {children}
      </div>
    </ProjectProvider>
  );
}

