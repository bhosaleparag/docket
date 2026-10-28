export const dynamic = "force-dynamic";
export const revalidate = 0;

import { GET } from "@/app/api/projects/route";
import ProjectsPageClient from "@/features/projects/ProjectsPageClient";

export default async function DashboardPage() {
  const res = await GET();
  const data = await res.json();
  const projects = data?.projects || [];

  return <ProjectsPageClient initialProjects={projects} />;
}


