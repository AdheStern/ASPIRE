// src/app/(system)/aspire/page.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProjectDashboard } from "@/components/aspire/project/project-dashboard";
import { getUserProjects } from "@/lib/actions/project-actions";
import { auth } from "@/lib/auth";

export default async function AspireHomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Obtener los proyectos del usuario
  const projects = await getUserProjects(session.user.id);
  return (
    <main className="bg-gray-50 dark:bg-transparent">
      <ProjectDashboard projects={projects} userId={session.user.id} />
    </main>
  );
}
