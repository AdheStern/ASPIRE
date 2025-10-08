// src/components/aspire/simulation/types.ts

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

export interface SpeakerSpecifications {
  type?: string;
  power_watts_peak?: number;
  power_watts_rms?: number;
  max_spl_db?: number;
  frequencyRange_minus_10_db?: string;
  frequencyRange_minus_3_db?: string;
  dispersion?: {
    horizontal?: number;
    vertical?: number;
  };
  weight_kg?: number;
  dimensions_mm: {
    height: number;
    width: number;
    depth: number;
  };
  notes?: string;
}

export interface Speaker3DData {
  id: string;
  nodeId?: string;
  catalogId?: string;
  brand?: string;
  model?: string;
  name?: string;
  position: Position3D;
  rotation?: Rotation3D;
  specifications: SpeakerSpecifications;
}

export type EditorMode = "geometry" | "speakers";
export type EditorTool = "select" | "move" | "rotate" | "scale";

export interface FaceMaterialMap {
  [faceIndex: number]: string;
}

export interface AbsorptionCoefficients {
  "125": number;
  "250": number;
  "500": number;
  "1k": number;
  "2k": number;
  "4k": number;
}

export interface AcousticMaterial {
  id: string;
  name: string;
  absorptionCoefficients: AbsorptionCoefficients;
}

export interface SceneData {
  id: string;
  name: string;
  project: {
    name: string;
  };
  geometryData?: {
    dimensions?: RoomDimensions;
    materials?: FaceMaterialMap;
  };
  soundSourceData?: {
    speakers?: Speaker3DData[];
  };
}

export interface RoomEditor3DProps {
  dimensions: RoomDimensions;
  showGrid?: boolean;
  showWireframe?: boolean;
  onFaceSelect?: (faceIndex: number | null) => void;
  selectedFace?: number | null;
  faceMaterials?: FaceMaterialMap;
  speakers?: Speaker3DData[];
  onSpeakerSelect?: (speakerId: string | null) => void;
  onSpeakerUpdate?: (speakerId: string, data: Partial<Speaker3DData>) => void;
  editorMode?: EditorMode;
  selectedTool?: EditorTool;
}

export interface RoomEditorLayoutProps {
  scene: SceneData;
  projectId: string;
  userId: string;
}
