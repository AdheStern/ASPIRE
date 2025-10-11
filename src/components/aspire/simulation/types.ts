// src/components/aspire/simulation/types.ts

/**
 * Tipos auxiliares para los datos de la escena
 * Estos tipos representan la estructura de datos que viene de la BD
 */

import type {
  RoomDimensions,
  SpeakerSpecifications,
} from "@/lib/three/types/editor.types";

// ============================================================================
// DATOS DE LA ESCENA (desde la base de datos)
// ============================================================================

export interface SceneData {
  id: string;
  name: string;
  description?: string | null;
  projectId: string;

  project: {
    id: string;
    name: string;
  };

  geometryData?: {
    dimensions: RoomDimensions;
    materials?: any;
  } | null;

  soundSourceData?: {
    speakers: SpeakerFromDB[];
  } | null;

  acousticData?: any | null;

  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SPEAKER DESDE LA BASE DE DATOS
// ============================================================================

export interface SpeakerFromDB {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  specifications: SpeakerSpecifications;
}

// ============================================================================
// MATERIALES (placeholder para futuro)
// ============================================================================

export interface MaterialData {
  id: string;
  name: string;
  absorptionCoefficient: number;
  scatteringCoefficient?: number;
}
