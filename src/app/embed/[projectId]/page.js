import { notFound } from "next/navigation";
import ChatWidget from "@/features/widget/ChatWidget";
import { GET } from "@/app/api/projects/[id]/route";

export default async function EmbedWidgetPage({ params }) {
  const resolvedParams = await params;
  const res = await GET(null, { params: { id: resolvedParams.projectId } });
  if (!res.ok) notFound();

  const data = await res.json();
  const project = data?.project;

  if (!project) notFound();

  return <ChatWidget projectId={project.id} projectName={project.name} />;
}

