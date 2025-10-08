// src/lib/types/simulation.ts

export interface RoomGeometry {
  type: "box" | "custom";
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  materials?: Record<string, string>; // surface ID -> material ID
  timestamp: string;
}

export interface SimulationSettings {
  geometryData?: RoomGeometry;
  materialAssignments?: Record<string, string>;
  speakerPositions?: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    orientation: { x: number; y: number; z: number };
  }>;
}
