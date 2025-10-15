// src/lib/api/transformers/scene-to-request.ts

/**
 * Transformador: Convierte el estado del editor 3D a formato de request del backend
 * Maneja conversiones de datos y validaciones necesarias
 */

import type { EditorState } from "@/lib/three/types/editor.types";
import type {
  RT60SimulationRequest,
  SimulationRequest,
  SimulationType,
} from "../types/simulation";

/**
 * Convierte el estado del editor a formato simplificado de request
 * @param editorState - Estado actual del editor 3D desde Zustand
 * @returns Request en formato simplificado (frontend)
 */
export function editorStateToSimulationRequest(
  editorState: EditorState
): SimulationRequest {
  // 1. Validar que hay datos necesarios
  if (editorState.speakers.length === 0) {
    throw new Error("No hay speakers configurados en la escena");
  }

  const hasMaterials = Object.values(editorState.faceMaterials).some(
    (mat) => mat.materialId !== "default"
  );

  if (!hasMaterials) {
    console.warn(
      "⚠️ No hay materiales asignados, se usarán valores por defecto"
    );
  }

  // 2. Convertir dimensiones
  const geometry = {
    width: editorState.dimensions.width,
    height: editorState.dimensions.height,
    depth: editorState.dimensions.depth,
  };

  // 3. Convertir speakers
  const speakers = editorState.speakers.map((speaker) => {
    // Extraer dispersión (manejar "Omni" o números)
    const horizontalDispersion =
      typeof speaker.specifications.dispersion.horizontal === "number"
        ? speaker.specifications.dispersion.horizontal
        : 360; // Omni = 360°

    const verticalDispersion =
      typeof speaker.specifications.dispersion.vertical === "number"
        ? speaker.specifications.dispersion.vertical
        : 360;

    return {
      id: speaker.id,
      speakerId: speaker.speakerId,
      position: {
        x: speaker.position[0],
        y: speaker.position[1],
        z: speaker.position[2],
      },
      rotation: {
        x: speaker.rotation[0],
        y: speaker.rotation[1],
        z: speaker.rotation[2],
      },
      dispersion: {
        horizontal: horizontalDispersion,
        vertical: verticalDispersion,
      },
    };
  });

  // 4. Convertir materiales acústicos
  // El backend espera coeficientes por banda de frecuencia
  const materials = {
    floor: getMaterialCoefficients(
      editorState.faceMaterials.floor.absorptionCoefficient
    ),
    ceiling: getMaterialCoefficients(
      editorState.faceMaterials.ceiling.absorptionCoefficient
    ),
    walls: {
      front: getMaterialCoefficients(
        editorState.faceMaterials.front.absorptionCoefficient
      ),
      back: getMaterialCoefficients(
        editorState.faceMaterials.back.absorptionCoefficient
      ),
      left: getMaterialCoefficients(
        editorState.faceMaterials.left.absorptionCoefficient
      ),
      right: getMaterialCoefficients(
        editorState.faceMaterials.right.absorptionCoefficient
      ),
    },
  };

  // 5. Configuración de simulación
  const config = {
    // Frecuencias estándar para análisis acústico (Hz)
    frequencies: [125, 250, 500, 1000, 2000, 4000],
    // Número de rayos para ray tracing (más = mejor calidad pero más lento)
    rayCount: 10000,
    // Número máximo de reflexiones
    maxReflections: 20,
    // Calcular RT60, EDT, Clarity, etc.
    calculateMetrics: true,
  };

  return {
    geometry,
    speakers,
    materials,
    config,
  };
}

/**
 * Convierte un coeficiente NRC (promedio) a coeficientes por banda
 * Esta es una aproximación - idealmente el backend debería recibir
 * los coeficientes reales de la BD por cada frecuencia
 */
function getMaterialCoefficients(nrc: number): Record<string, number> {
  // Por ahora usar el mismo coeficiente para todas las frecuencias
  // TODO: Obtener coeficientes reales de la BD por cada banda
  return {
    "125": nrc * 0.8, // Bajas frecuencias suelen tener menor absorción
    "250": nrc * 0.9,
    "500": nrc,
    "1000": nrc,
    "2000": nrc * 1.1,
    "4000": nrc * 1.2, // Altas frecuencias suelen tener mayor absorción
  };
}

/**
 * Valida que un request de simulación tenga todos los datos necesarios
 */
export function validateSimulationRequest(request: SimulationRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar geometría
  if (
    !request.geometry ||
    request.geometry.width <= 0 ||
    request.geometry.height <= 0 ||
    request.geometry.depth <= 0
  ) {
    errors.push("Dimensiones de la habitación inválidas");
  }

  // Validar speakers
  if (!request.speakers || request.speakers.length === 0) {
    errors.push("Debe haber al menos un speaker configurado");
  }

  // Validar materiales
  if (!request.materials) {
    errors.push("Faltan materiales acústicos");
  }

  // Validar configuración
  if (
    !request.config ||
    !request.config.frequencies ||
    request.config.frequencies.length === 0
  ) {
    errors.push("Configuración de simulación inválida");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Helper: Obtiene un resumen legible del request
 */
export function getSimulationSummary(request: SimulationRequest): string {
  const { geometry, speakers, config } = request;

  return `
📊 Resumen de Simulación:
- Habitación: ${geometry.width}m × ${geometry.height}m × ${geometry.depth}m
- Speakers: ${speakers.length}
- Frecuencias: ${config.frequencies.join(", ")} Hz
- Rayos: ${config.rayCount}
- Reflexiones máx: ${config.maxReflections}
  `.trim();
}

/**
 * Transforma SimulationRequest (frontend) a RT60SimulationRequest (backend)
 * @param frontendRequest - Request en formato simplificado del frontend
 * @param simulationType - Tipo de simulación a ejecutar
 * @returns Request en formato del backend
 */
export function transformToBackendRequest(
  frontendRequest: SimulationRequest,
  simulationType: SimulationType = "rt60_sabine"
): RT60SimulationRequest {
  const { geometry, materials, config, speakers } = frontendRequest;

  // Convertir geometría (width/height/depth → length/width/height)
  const backendGeometry = {
    type: "box" as const,
    dimensions: {
      length: geometry.width,
      width: geometry.depth,
      height: geometry.height,
    },
  };

  // Convertir materiales
  const backendMaterials = {
    floor: {
      material_id: "floor-material",
      absorption: convertCoefficients(materials.floor),
    },
    ceiling: {
      material_id: "ceiling-material",
      absorption: convertCoefficients(materials.ceiling),
    },
    wall_front: {
      material_id: "front-material",
      absorption: convertCoefficients(materials.walls.front),
    },
    wall_back: {
      material_id: "back-material",
      absorption: convertCoefficients(materials.walls.back),
    },
    wall_left: {
      material_id: "left-material",
      absorption: convertCoefficients(materials.walls.left),
    },
    wall_right: {
      material_id: "right-material",
      absorption: convertCoefficients(materials.walls.right),
    },
  };

  // Convertir speakers a sources (si hay) - TEMPORAL: comentado para debug
  // const sources = speakers.map((speaker) => ({
  //   id: speaker.id,
  //   type: "speaker" as const,
  //   model_id: speaker.speakerId,
  //   position: speaker.position,
  //   orientation: {
  //     yaw: speaker.rotation.y,
  //     pitch: speaker.rotation.x,
  //     roll: speaker.rotation.z,
  //   },
  //   power_db: 95,
  //   directivity: speaker.dispersion,
  // }));

  // Parámetros de simulación
  const params = {
    temperature: 20, // °C
    humidity: 50, // %
    frequency_bands: config.frequencies,
  };

  return {
    simulation_type: simulationType,
    geometry: backendGeometry,
    materials: backendMaterials,
    // sources: sources.length > 0 ? sources : undefined, // ← Comentado temporalmente
    params,
  };
}

/**
 * Convierte coeficientes de Record<string, number> a formato del backend
 */
function convertCoefficients(coeffs: Record<string, number>) {
  return {
    "125": coeffs["125"] || 0.1,
    "250": coeffs["250"] || 0.1,
    "500": coeffs["500"] || 0.1,
    "1000": coeffs["1000"] || 0.1,
    "2000": coeffs["2000"] || 0.1,
    "4000": coeffs["4000"] || 0.1,
  };
}
