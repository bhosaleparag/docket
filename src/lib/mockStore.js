// Temporary in-memory store. Every function here is written the way a real
// DB-backed version would be — callers (route handlers, server components)
// won't need to change when this gets swapped for actual Postgres queries.

let projects = [
  {
    id: "proj_saas1",
    name: "SaaS Docs Demo",
    description: "Support bot for the product docs site.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    docs: [
      { name: "pricing-faq.md", status: "processed" },
      { name: "onboarding-guide.pdf", status: "processed" },
      { name: "api-reference.pdf", status: "processed" },
    ],
  },
  {
    id: "proj_r3st0",
    name: "Restaurant Demo",
    description: "Answers menu, hours, and reservation questions.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    docs: [
      { name: "menu.pdf", status: "processed" },
      { name: "reservations-faq.md", status: "processed" },
    ],
  },
];

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function listProjects() {
  return projects;
}

export function getProject(id) {
  return projects.find((p) => p.id === id) ?? null;
}

export function createProject({ name, description }) {
  const project = {
    id: generateId("proj"),
    name,
    description: description ?? "",
    createdAt: new Date().toISOString(),
    docs: [],
  };
  projects = [...projects, project];
  return project;
}

export function addDocuments(projectId, fileName, chunks, embeddings) {
  const project = getProject(projectId);
  if (!project) return null;

  project.docs.push({ name: fileName, chunks });

  return project;
}
