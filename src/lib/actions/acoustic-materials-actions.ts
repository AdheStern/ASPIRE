// src/lib/actions/acoustic-materials-actions.ts
"use server";

import { db } from "../db";

// Obtener los materiales acústicos
export async function getAcousticMaterials() {
  try {
    const materials = await db.acousticMaterial.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const serialized = JSON.stringify(materials);
    const parsed = JSON.parse(serialized);

    console.log("✅ Materials count:", parsed.length);
    console.log(
      "✅ First material coefficients:",
      parsed[0]?.absorptionCoefficients
    );

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error("❌ Error fetching acoustic materials:", error);
    return {
      success: false,
      error: "Error al cargar los materiales acústicos",
      data: [],
    };
  }
}
