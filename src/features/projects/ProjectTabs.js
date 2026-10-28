"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["documents", "Documents"],
  ["chat", "Test chat"],
  ["embed", "Embed code"],
];

export default function ProjectTabs({ projectId }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 px-8 border-b border-line bg-[#F5F3EC]">
      {TABS.map(([key, label]) => {
        const href = `/dashboard/${projectId}/${key}`;
        const active = pathname === href;
        return (
          <Link
            key={key}
            href={href}
            className={`px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active ? "border-forest text-forest" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
