// src/lib/api/types/simulation.ts

/**
 * Types para la API de simulación
 * Sincronizados con los modelos Pydantic del backend
 */

// ============================================================================
// ENUMS
// ============================================================================

export type SimulationType = "rt60_sabine" | "rt60_eyring" | "rt60_ism";
export type SimulationStatus = "success" | "error";

// ============================================================================
// GEOMETRY
// ============================================================================

export interface BoxDimensions {
  length: number;
  width: number;
  height: number;
}

export interface BoxGeometry {
  type: "box";
  dimensions: BoxDimensions;
}

// ============================================================================
// MATERIALS
// ============================================================================

export interface AbsorptionCoefficients {
  "125": number;
  "250": number;
  "500": number;
  "1000": number;
  "2000": number;
  "4000": number;
}

export interface SurfaceMaterial {
  material_id: string;
  name?: string;
  absorption: AbsorptionCoefficients;
}

export interface RoomMaterials {
  floor: SurfaceMaterial;
  ceiling: SurfaceMaterial;
  wall_front: SurfaceMaterial;
  wall_back: SurfaceMaterial;
  wall_left: SurfaceMaterial;
  wall_right: SurfaceMaterial;
}

// ============================================================================
// SOURCES (Para ISM - FASE 2)
// ============================================================================

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Orientation3D {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface DirectivityPattern {
  horizontal: number;
  vertical: number;
}

export interface SoundSource {
  id: string;
  type: "speaker" | "instrument";
  model_id?: string;
  position: Position3D;
  orientation: Orientation3D;
  power_db: number;
  directivity: DirectivityPattern;
}

export interface MeasurementPoint {
  id: string;
  position: Position3D;
  name?: string;
}

// ============================================================================
// SIMULATION PARAMETERS
// ============================================================================

export interface SimulationParams {
  temperature: number;
  humidity: number;
  frequency_bands: number[];
}

// ============================================================================
// REQUEST (Backend format)
// ============================================================================

export interface RT60SimulationRequest {
  simulation_type: SimulationType;
  geometry: BoxGeometry;
  materials: RoomMaterials;
  sources?: SoundSource[];
  receivers?: MeasurementPoint[];
  params: SimulationParams;
}

// ============================================================================
// REQUEST (Frontend format - para el transformador)
// ============================================================================

/**
 * Formato simplificado del request desde el frontend
 * Se transforma a RT60SimulationRequest antes de enviar al backend
 */
export interface SimulationRequest {
  geometry: {
    width: number;
    height: number;
    depth: number;
  };
  speakers: Array<{
    id: string;
    speakerId: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    dispersion: { horizontal: number; vertical: number };
  }>;
  materials: {
    floor: Record<string, number>;
    ceiling: Record<string, number>;
    walls: {
      front: Record<string, number>;
      back: Record<string, number>;
      left: Record<string, number>;
      right: Record<string, number>;
    };
  };
  config: {
    frequencies: number[];
    rayCount: number;
    maxReflections: number;
    calculateMetrics: boolean;
  };
}

// ============================================================================
// RESPONSE
// ============================================================================

export interface SimulationMetadata {
  simulation_id: string | null;
  engine_used: string;
  execution_time_seconds: number;
  timestamp: string;
}

export interface RT60Results {
  rt60_by_band: Record<string, number>;
  average_rt60: number;
}

export interface RT60SimulationResponse {
  status: SimulationStatus;
  metadata: SimulationMetadata;
  results: RT60Results | null;
  error_message: string | null;
}
