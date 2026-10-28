import { redirect } from "next/navigation";

export default function ProjectIndexPage({ params }) {
  redirect(`/dashboard/${params.id}/documents`);
}
