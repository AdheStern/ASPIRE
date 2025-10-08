// src/app/(system)/projects/[projectId]/scenes/[sceneId]/room-editor/page.tsx
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { RoomEditorLayout } from "@/components/aspire/simulation/room-editor-layout";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RoomEditorPageProps {
  params: Promise<{
    projectId: string;
    sceneId: string;
  }>;
}

export default async function RoomEditorPage({ params }: RoomEditorPageProps) {
  const { projectId, sceneId } = await params;

  // Obtener sesión
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Obtener escena con proyecto
  const scene = await db.scene.findFirst({
    where: {
      id: sceneId,
      project: {
        id: projectId,
        userId: session.user.id,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!scene) {
    notFound();
  }

  // biome-ignore lint/correctness/noChildrenProp: its temporally until we add the editor components
  return <RoomEditorLayout children={undefined} />;
}
