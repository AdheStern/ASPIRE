// src/lib/types/acoustic-material.types.ts

/**
 * Estructura de coeficientes de absorción acústica por banda de frecuencia
 * Nota: Las claves usan formato hz125, hz250, etc. en lugar de "125", "250"
 * para evitar problemas de serialización en Next.js
 */
export interface AbsorptionCoefficients {
  hz125: number;
  hz250: number;
  hz500: number;
  hz1k: number;
  hz2k: number;
  hz4k: number;
}

/**
 * Material acústico con coeficientes de absorción
 */
export interface AcousticMaterial {
  id: string;
  name: string;
  description?: string | null;
  absorptionCoefficients: AbsorptionCoefficients;
}

/**
 * Respuesta del action getAcousticMaterials
 */
export interface GetAcousticMaterialsResponse {
  success: boolean;
  data: AcousticMaterial[];
  error?: string;
}
