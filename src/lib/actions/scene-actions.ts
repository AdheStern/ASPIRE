// src/lib/actions/scene-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import type { Edge, Node } from "reactflow";
import type { Speaker3DData } from "@/components/aspire/simulation/types";
import { db } from "@/lib/db";
import type { SceneFormData } from "@/lib/schemas/scene-schema";
import { sceneSchema, sceneUpdateSchema } from "@/lib/schemas/scene-schema";
import type { RoomGeometry } from "@/lib/types/simulation";

// Crear escena
export async function createScene(
  data: SceneFormData,
  projectId: string,
  userId: string
) {
  try {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return { success: false, error: "Proyecto no encontrado" };
    }

    const validatedData = sceneSchema.parse(data);

    const scene = await db.scene.create({
      data: {
        ...validatedData,
        projectId,
        geometryData: {},
        soundSourceData: {},
        instrumentSetup: {},
      },
      include: {
        _count: {
          select: {
            simulationRuns: true,
            measurements: true,
          },
        },
      },
    });

    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: scene };
  } catch (error) {
    console.error("Error creating scene:", error);
    return { success: false, error: "Error al crear la escena" };
  }
}

// Obtener escenas de un proyecto
export async function getProjectScenes(projectId: string, userId: string) {
  try {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return [];
    }

    const scenes = await db.scene.findMany({
      where: { projectId },
      include: {
        _count: {
          select: {
            simulationRuns: true,
            measurements: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return scenes;
  } catch (error) {
    console.error("Error fetching scenes:", error);
    return [];
  }
}

// Duplicar escena
export async function duplicateScene(sceneId: string, userId: string) {
  try {
    const originalScene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId,
        },
      },
    });

    if (!originalScene) {
      return { success: false, error: "Escena no encontrada" };
    }

    const duplicatedScene = await db.scene.create({
      data: {
        name: `${originalScene.name} (copia)`,
        projectId: originalScene.projectId,
        geometryData: originalScene.geometryData as any,
        soundSourceData: originalScene.soundSourceData as any,
        instrumentSetup: originalScene.instrumentSetup as any,
      },
      include: {
        _count: {
          select: {
            simulationRuns: true,
            measurements: true,
          },
        },
      },
    });

    revalidatePath(`/projects/${originalScene.projectId}`);
    return { success: true, data: duplicatedScene };
  } catch (error) {
    console.error("Error duplicating scene:", error);
    return { success: false, error: "Error al duplicar la escena" };
  }
}

// Actualizar escena
export async function updateScene(
  sceneId: string,
  data: Partial<SceneFormData>,
  userId: string
) {
  try {
    const scene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId,
        },
      },
    });

    if (!scene) {
      return { success: false, error: "Escena no encontrada" };
    }

    const validatedData = sceneUpdateSchema.parse(data);

    const updatedScene = await db.scene.update({
      where: { id: sceneId },
      data: validatedData,
    });

    revalidatePath(`/projects/${scene.projectId}`);
    return { success: true, data: updatedScene };
  } catch (error) {
    console.error("Error updating scene:", error);
    return { success: false, error: "Error al actualizar la escena" };
  }
}

// Eliminar escena
export async function deleteScene(sceneId: string, userId: string) {
  try {
    const scene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId,
        },
      },
    });

    if (!scene) {
      return { success: false, error: "Escena no encontrada" };
    }

    await db.scene.delete({
      where: { id: sceneId },
    });

    revalidatePath(`/projects/${scene.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting scene:", error);
    return { success: false, error: "Error al eliminar la escena" };
  }
}

// Actualizar instrumentSetup de una escena
export async function updateSceneInstrumentSetup(
  sceneId: string,
  userId: string,
  data: {
    nodes: Node[];
    edges: Edge[];
  }
) {
  try {
    const scene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId: userId,
        },
      },
    });

    if (!scene) {
      return { success: false, error: "Escena no encontrada o sin permisos" };
    }

    await db.scene.update({
      where: { id: sceneId },
      data: {
        instrumentSetup: {
          nodes: data.nodes,
          edges: data.edges,
          version: "1.0",
          updatedAt: new Date().toISOString(),
        } as any,
      },
    });

    revalidatePath(`/projects/${scene.projectId}`);
    revalidatePath(`/projects/${scene.projectId}/scenes/${sceneId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating scene instrument setup:", error);
    return { success: false, error: "Error al guardar la configuración" };
  }
}

// Actualizar geometryData de una escena
export async function updateSceneGeometry(
  sceneId: string,
  userId: string,
  geometryData: RoomGeometry
) {
  try {
    const scene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId: userId,
        },
      },
    });

    if (!scene) {
      return { success: false, error: "Escena no encontrada o sin permisos" };
    }

    await db.scene.update({
      where: { id: sceneId },
      data: {
        geometryData: geometryData as any,
        updatedAt: new Date(),
      },
    });

    revalidatePath(
      `/projects/${scene.projectId}/scenes/${sceneId}/room-editor`
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating scene geometry:", error);
    return { success: false, error: "Error al guardar la geometría" };
  }
}

// Actualizar soundSourceData de una escena con los parlantes
export async function updateSceneSpeakers(
  sceneId: string,
  userId: string,
  speakers: Speaker3DData[]
) {
  try {
    const scene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId: userId,
        },
      },
    });

    if (!scene) {
      return { success: false, error: "Escena no encontrada o sin permisos" };
    }

    await db.scene.update({
      where: { id: sceneId },
      data: {
        soundSourceData: {
          speakers: speakers,
          version: "1.0",
          updatedAt: new Date().toISOString(),
        } as any,
        updatedAt: new Date(),
      },
    });

    revalidatePath(
      `/projects/${scene.projectId}/scenes/${sceneId}/room-editor`
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating scene speakers:", error);
    return { success: false, error: "Error al guardar los parlantes" };
  }
}

// Obtener los parlantes de una escena
export async function getSceneSpeakers(sceneId: string, userId: string) {
  try {
    const scene = await db.scene.findFirst({
      where: {
        id: sceneId,
        project: {
          userId: userId,
        },
      },
      select: {
        soundSourceData: true,
      },
    });

    if (!scene) {
      return { success: false, error: "Escena no encontrada", data: [] };
    }

    const soundSourceData = scene.soundSourceData as any;
    const speakers: Speaker3DData[] = soundSourceData?.speakers || [];

    return { success: true, data: speakers };
  } catch (error) {
    console.error("Error getting scene speakers:", error);
    return { success: false, error: "Error al cargar los parlantes", data: [] };
  }
}
