// /src/app/(system)/projects/[projectId]/scenes/[sceneId]/page.tsx

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Edge, Node } from "reactflow";
import { SceneEditor } from "@/components/aspire/editor/scene-editor";
// ¡Importante! Importamos la Server Action que queremos llamar
import { updateSceneInstrumentSetup } from "@/lib/actions/scene-actions";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface SceneEditorPageProps {
  params: Promise<{
    projectId: string;
    sceneId: string;
  }>;
}

export default async function SceneEditorPage({
  params,
}: SceneEditorPageProps) {
  const { projectId, sceneId } = await params;

  // Obtener sesión (tu lógica es correcta)
  const readonlyHeaders = await headers();
  const mutableHeaders = new Headers(readonlyHeaders);
  const session = await auth.api.getSession({
    headers: mutableHeaders,
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }

  // Obtener escena con proyecto (tu lógica es correcta)
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

  // Obtener catálogos de equipos (tu lógica es correcta)
  const [instruments, speakers, mixers, processors, microphones] =
    await Promise.all([
      db.instrumentModel.findMany(),
      db.speakerModel.findMany(),
      db.mixerModel.findMany(),
      db.processorModel.findMany(),
      db.microphoneModel.findMany(),
    ]);

  // --- INICIO DE LA LÓGICA DE GUARDADO ---

  // Definimos la función de guardado que pasaremos como prop al componente cliente.
  async function handleSaveScene(data: { nodes: Node[]; edges: Edge[] }) {
    "use server";

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    const result = await updateSceneInstrumentSetup(sceneId, userId, data);

    // Si la acción del servidor falla, lanzamos un error para que el cliente
    // (el componente SceneEditor) pueda capturarlo y mostrar un toast de error.
    if (!result.success) {
      throw new Error(result.error || "Ocurrió un error al guardar la escena.");
    }

    // Si tiene éxito, no necesitamos hacer nada más aquí,
    // el cliente mostrará el toast de éxito.
  }

  // --- FIN DE LA LÓGICA DE GUARDADO ---

  return (
    <SceneEditor
      scene={scene}
      catalogs={{
        instruments,
        speakers,
        mixers,
        processors,
        microphones,
      }}
      userId={userId}
      // Pasamos la Server Action definida arriba como la prop 'onSave'
      onSave={handleSaveScene}
    />
  );
}
