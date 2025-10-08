// src/lib/types/project.ts

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ProjectWithCount extends Project {
  _count: {
    scenes: number;
  };
}

export interface ProjectWithScenes extends Project {
  scenes: Scene[];
}

export interface Scene {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  geometryData: unknown;
  soundSourceData: unknown;
  instrumentSetup: unknown;
  projectId: string;
}
