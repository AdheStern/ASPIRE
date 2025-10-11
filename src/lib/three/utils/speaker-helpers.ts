// src/lib/three/utils/speaker-helpers.ts

import { MM_TO_METERS } from "../constants/editor.constants";
import type { Speaker3DData } from "../types/editor.types";

/**
 * Convierte grados a radianes
 */
export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convierte dimensiones de mm a metros
 */
export function getSpeakerDimensions(speaker: Speaker3DData) {
  const dims = speaker.specifications.dimensions_mm;
  return {
    width: dims.width * MM_TO_METERS,
    height: dims.height * MM_TO_METERS,
    depth: dims.depth * MM_TO_METERS,
  };
}

/**
 * Verifica si un speaker es omnidireccional
 * Los subwoofers típicamente tienen dispersión "Omni" o 360°
 */
export function isOmnidirectional(dispersion: {
  horizontal: number | string;
  vertical: number | string;
}): boolean {
  const h = dispersion.horizontal;
  const v = dispersion.vertical;

  // Verificar si es string "Omni" o "omni"
  if (typeof h === "string" && h.toLowerCase().includes("omni")) {
    return true;
  }

  if (typeof v === "string" && v.toLowerCase().includes("omni")) {
    return true;
  }

  // Verificar si es 360° o mayor
  if (typeof h === "number" && h >= 360) return true;
  if (typeof v === "number" && v >= 360) return true;

  return false;
}

/**
 * Obtiene valores numéricos válidos de dispersión
 * Retorna valores por defecto si no son válidos
 */
export function getValidDispersion(dispersion: {
  horizontal: number | string;
  vertical: number | string;
}): { horizontal: number; vertical: number } {
  const DEFAULT_HORIZONTAL = 90;
  const DEFAULT_VERTICAL = 60;

  let horizontal = DEFAULT_HORIZONTAL;
  let vertical = DEFAULT_VERTICAL;

  // Parsear horizontal
  if (typeof dispersion.horizontal === "number") {
    horizontal = dispersion.horizontal;
  } else if (typeof dispersion.horizontal === "string") {
    const parsed = Number.parseFloat(dispersion.horizontal);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed < 360) {
      horizontal = parsed;
    }
  }

  // Parsear vertical
  if (typeof dispersion.vertical === "number") {
    vertical = dispersion.vertical;
  } else if (typeof dispersion.vertical === "string") {
    const parsed = Number.parseFloat(dispersion.vertical);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed < 360) {
      vertical = parsed;
    }
  }

  return { horizontal, vertical };
}

/**
 * Obtiene el nombre del speaker desde sus especificaciones o nombre directo
 * Fallback: usa el ID o speakerId si no hay nombre
 */
export function getSpeakerName(speaker: Speaker3DData): string {
  // 1. Si tiene nombre directo y NO es un ID de nodo genérico
  if (
    speaker.name &&
    speaker.name.trim() !== "" &&
    !speaker.name.startsWith("speaker-3d-")
  ) {
    return speaker.name;
  }

  // 2. Intentar construir desde speakerId (formato: "jbl-prx908")
  const speakerId = speaker.speakerId || speaker.id;

  // Verificar que NO sea un ID de nodo interno
  if (
    speakerId &&
    !speakerId.startsWith("speaker-3d-") &&
    speakerId.includes("-")
  ) {
    // Si tiene formato brand-model, formatearlo
    const parts = speakerId.split("-");
    const brand = parts[0].toUpperCase(); // jbl -> JBL
    const model = parts.slice(1).join(" ").toUpperCase(); // prx908 -> PRX908
    return `${brand} ${model}`;
  }

  // 3. NUEVO: Si es un nodo genérico, intentar extraer info del tipo
  // Ejemplo: "Passive Subwoofer" → mostrar eso en lugar del ID
  if (speaker.specifications.type) {
    return speaker.specifications.type;
  }

  // 4. Último fallback: mostrar ID pero con formato más amigable
  if (speakerId.startsWith("speaker-3d-node_")) {
    const nodeNumber = speakerId.replace("speaker-3d-node_", "");
    return `Speaker Node ${nodeNumber}`;
  }

  // 5. Fallback final
  return speakerId || speaker.id;
}
