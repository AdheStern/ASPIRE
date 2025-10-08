// src/lib/actions/acoustic-materials-actions.ts
"use server";

import { db } from "../db";

export async function getAcousticMaterials() {
  try {
    const materials = await db.acousticMaterial.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: materials,
    };
  } catch (error) {
    console.error("Error fetching acoustic materials:", error);
    return {
      success: false,
      error: "Error al cargar los materiales acústicos",
      data: [],
    };
  }
}
