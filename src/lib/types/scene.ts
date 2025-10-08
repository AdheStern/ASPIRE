// src/lib/types/scene.ts

import type { Prisma } from "@prisma/client";

export interface Scene {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  geometryData: Prisma.JsonValue | Record<string, unknown>;
  soundSourceData: Prisma.JsonValue | Record<string, unknown>;
  instrumentSetup: Prisma.JsonValue | Record<string, unknown>;
  projectId: string;
}

export interface SceneWithSimulations extends Scene {
  _count: {
    simulationRuns: number;
    measurements: number;
  };
}

export interface SceneWithProject extends Scene {
  project: {
    id: string;
    name: string;
    userId: string;
  };
}
