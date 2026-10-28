import Link from "next/link";
import { FileText } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export default function ProjectCard({ project }) {
  const docCount = project.docs?.length || 0;

  return (
    <div className="border border-line bg-white rounded-lg p-5">
      <p className="font-medium mb-1">{project.name}</p>
      {project.description && (
        <p className="text-muted text-xs mb-3 leading-relaxed">{project.description}</p>
      )}
      <p className="text-muted text-xs mb-4">
        {docCount === 0
          ? "No documents yet"
          : `${docCount} ${docCount === 1 ? "document" : "documents"}`}
        {" · "}
        created {formatRelativeTime(project.createdAt)}
      </p>
      <Link
        href={`/dashboard/${project.id}/documents`}
        className="flex items-center gap-1.5 text-forest text-xs font-medium hover:underline w-fit"
      >
        <FileText size={13} /> Manage documents
      </Link>
    </div>
  );
}
