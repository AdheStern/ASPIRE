// src/app/(system)/projects/[projectId]/scenes/[sceneId]/room-editor/page.tsx

/**
 * Página del editor 3D de habitaciones
 * Ruta: /projects/[projectId]/scenes/[sceneId]/room-editor
 */

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { RoomEditorLayout } from "@/components/aspire/simulation/room-editor/room-editor-layout";
import { getAcousticMaterials } from "@/lib/actions/acoustic-materials-actions";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RoomEditorPageProps {
  params: Promise<{
    projectId: string;
    sceneId: string;
  }>;
}

export default async function RoomEditorPage({ params }: RoomEditorPageProps) {
  // Next.js 15: await params antes de usarlos
  const { projectId, sceneId } = await params;

  // Obtener sesión usando headers (método correcto)
  const readonlyHeaders = await headers();
  const mutableHeaders = new Headers(readonlyHeaders);
  const session = await auth.api.getSession({
    headers: mutableHeaders,
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  // Obtener la escena con sus datos
  const scene = await db.scene.findFirst({
    where: {
      id: sceneId,
      project: {
        id: projectId,
        userId: userId,
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

  // Cargar materiales acústicos desde la BD
  const materialsResult = await getAcousticMaterials();
  const materials = materialsResult.success ? materialsResult.data : [];

  return (
    <RoomEditorLayout
      scene={scene as any}
      projectId={projectId}
      userId={userId}
      materials={materials}
    />
  );
}
