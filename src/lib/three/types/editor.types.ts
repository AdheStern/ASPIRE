// src/lib/three/types/editor.types.ts

/**
 * Tipos centralizados para el editor 3D
 * Basado en la arquitectura del Three.js Editor oficial
 */

// ============================================================================
// HERRAMIENTAS Y MODOS
// ============================================================================

export type Tool = "select" | "move" | "rotate";

export type ViewMode = "perspective" | "top" | "front" | "side";

export type EditorMode = "geometry" | "speakers";

// ============================================================================
// DIMENSIONES Y GEOMETRÍA
// ============================================================================

export interface RoomDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3D {
  x: number;
  y: number;
  z: number;
}

// ============================================================================
// SPEAKERS (PARLANTES)
// ============================================================================

/**
 * Especificaciones del speaker tal como vienen de la BD (JSON)
 * Compatible con el seed de speakers de JBL PRX Series
 */
export interface SpeakerSpecifications {
  // Dimensiones físicas (siempre presentes)
  dimensions_mm: {
    width: number;
    height: number;
    depth: number;
  };

  // Dispersión (puede ser número o "Omni" para subwoofers)
  dispersion: {
    horizontal: number | string;
    vertical: number | string;
  };

  // Tipo de speaker
  type?: string;

  // Potencia (diferentes tipos según el modelo)
  power_watts_peak?: number;
  power_watts_rms?: number;
  power_watts_continuous?: number;
  power_watts_program?: number;
  power_handling?: number;

  // SPL (Sound Pressure Level)
  max_spl_db?: number;
  max_spl?: number; // Mantener para compatibilidad

  // Rango de frecuencia
  frequencyRange_minus_10_db?: string;
  frequencyRange_minus_3_db?: string;
  frequency_response?: {
    min: number;
    max: number;
  };

  // Peso
  weight_kg?: number;

  // Notas adicionales
  notes?: string;

  // Otros campos que puedan venir de la BD
  [key: string]: unknown;
}

export interface Speaker3DData {
  id: string;
  name?: string; // Opcional, se genera desde el ID si no existe
  position: [number, number, number]; // [x, y, z] para R3F
  rotation: [number, number, number]; // [x, y, z] para R3F
  scale: [number, number, number]; // [x, y, z] para R3F
  speakerId: string; // ID del modelo de speaker (ej: "jbl-prx908")
  specifications: SpeakerSpecifications;
}

/**
 * Speaker tal como viene de la BD (soundSourceData)
 */
export interface SpeakerFromDB {
  id: string;
  name?: string;
  speakerId?: string; // Puede no estar presente en datos viejos
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
// MATERIALES
// ============================================================================

export type FaceType =
  | "floor"
  | "ceiling"
  | "front"
  | "back"
  | "left"
  | "right";

export interface FaceMaterial {
  materialId: string;
  absorptionCoefficient: number;
  color?: string;
}

export type FaceMaterialsMap = Record<FaceType, FaceMaterial>;

// ============================================================================
// ESTADO DEL EDITOR
// ============================================================================

export interface EditorState {
  // Modo actual
  mode: EditorMode;
  tool: Tool;
  viewMode: ViewMode;

  // Selección
  selectedSpeaker: string | null;
  hoveredSpeaker: string | null;
  selectedFace: FaceType | null;

  // Geometría
  dimensions: RoomDimensions;

  // Speakers
  speakers: Speaker3DData[];

  // Materiales
  faceMaterials: FaceMaterialsMap;

  // UI
  showGrid: boolean;
  showWireframe: boolean;
  showAxes: boolean;
}

// ============================================================================
// ACCIONES DEL EDITOR (Command Pattern)
// ============================================================================

export interface EditorAction {
  type: string;
  execute: () => void;
  undo: () => void;
}

export interface MoveSpeakerAction extends EditorAction {
  type: "MOVE_SPEAKER";
  speakerId: string;
  oldPosition: [number, number, number];
  newPosition: [number, number, number];
}

export interface RotateSpeakerAction extends EditorAction {
  type: "ROTATE_SPEAKER";
  speakerId: string;
  oldRotation: [number, number, number];
  newRotation: [number, number, number];
}

export interface UpdateDimensionAction extends EditorAction {
  type: "UPDATE_DIMENSION";
  dimension: "width" | "height" | "depth";
  oldValue: number;
  newValue: number;
}

// ============================================================================
// EVENTOS (Signals Pattern)
// ============================================================================

export type EditorEventType =
  | "speaker:selected"
  | "speaker:moved"
  | "speaker:rotated"
  | "speaker:added"
  | "speaker:removed"
  | "dimension:changed"
  | "material:changed"
  | "tool:changed"
  | "mode:changed";

export interface EditorEvent<T = unknown> {
  type: EditorEventType;
  payload: T;
  timestamp: number;
}

// ============================================================================
// PROPS DE COMPONENTES
// ============================================================================

export interface RoomEditorCanvasProps {
  dimensions: RoomDimensions;
  speakers: Speaker3DData[];
  selectedSpeaker: string | null;
  selectedTool: Tool;
  showGrid: boolean;
  onSelectSpeaker: (id: string | null) => void;
  onUpdateSpeaker: (id: string, data: Partial<Speaker3DData>) => void;
}

export interface SpeakerObjectProps {
  speaker: Speaker3DData;
  isSelected: boolean;
  selectedTool: Tool;
  onSelect: () => void;
  onUpdate: (data: {
    position?: [number, number, number];
    rotation?: [number, number, number];
  }) => void;
}

export interface RoomGeometryProps {
  dimensions: RoomDimensions;
  materials?: FaceMaterialsMap;
  onFaceClick?: (face: FaceType) => void;
}
