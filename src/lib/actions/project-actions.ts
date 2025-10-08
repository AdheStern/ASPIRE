// src/lib/actions/project-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ProjectFormData } from "@/lib/schemas/project-schema";
import { projectSchema } from "@/lib/schemas/project-schema";

// Crear proyecto
export async function createProject(data: ProjectFormData, userId: string) {
  try {
    const validatedData = projectSchema.parse(data);

    const project = await db.project.create({
      data: {
        ...validatedData,
        userId,
        description: validatedData.description || null,
      },
      include: {
        _count: {
          select: { scenes: true },
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Error al crear el proyecto" };
  }
}

// Obtener proyectos del usuario
export async function getUserProjects(userId: string) {
  try {
    const projects = await db.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { scenes: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Actualizar proyecto
export async function updateProject(
  projectId: string,
  data: ProjectFormData,
  userId: string
) {
  try {
    const validatedData = projectSchema.parse(data);

    const project = await db.project.update({
      where: {
        id: projectId,
        userId, // Verificación de seguridad
      },
      data: {
        ...validatedData,
        description: validatedData.description || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Error al actualizar el proyecto" };
  }
}

// Eliminar proyecto
export async function deleteProject(projectId: string, userId: string) {
  try {
    await db.project.delete({
      where: {
        id: projectId,
        userId, // Verificación de seguridad
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Error al eliminar el proyecto" };
  }
}
