// src/app/(system)/projects/[projectId]/page.tsx

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ProjectDetailPage } from "@/components/aspire/project/project-detail-page";
import { getProjectScenes } from "@/lib/actions/scene-actions";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  // Obtener sesión
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Obtener proyecto
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: session.user.id,
    },
  });

  if (!project) {
    notFound();
  }

  // Obtener escenas
  const scenes = await getProjectScenes(projectId, session.user.id);

  return (
    <ProjectDetailPage
      project={project}
      scenes={scenes}
      userId={session.user.id}
    />
  );
}
