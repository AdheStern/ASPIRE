// src/components/aspire/project/project-detail-page.tsx
"use client";

import { useState } from "react";
import { CreateSceneDialog } from "@/components/aspire/scene/forms/create-scene-dialog";
import { SceneList } from "@/components/aspire/scene/scene-list";
import type { Project } from "@/lib/types/project";
import type { SceneWithSimulations } from "@/lib/types/scene";
import { ProjectHeader } from "./project-header";

interface ProjectDetailPageProps {
  project: Project;
  scenes: SceneWithSimulations[];
  userId: string;
}

export function ProjectDetailPage({
  project,
  scenes: initialScenes,
  userId,
}: ProjectDetailPageProps) {
  const [scenes, setScenes] = useState(initialScenes);
  const [isCreateSceneOpen, setIsCreateSceneOpen] = useState(false);

  const handleSceneCreated = (newScene: SceneWithSimulations) => {
    setScenes((prev) => [newScene, ...prev]);
  };

  const handleSceneDeleted = (sceneId: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== sceneId));
  };

  const handleSceneDuplicated = (duplicatedScene: SceneWithSimulations) => {
    setScenes((prev) => [duplicatedScene, ...prev]);
  };

  return (
    <div className="h-full flex flex-col">
      <ProjectHeader project={project} scenesCount={scenes.length} />

      <SceneList
        scenes={scenes}
        projectId={project.id}
        userId={userId}
        onCreateScene={() => setIsCreateSceneOpen(true)}
        onSceneDeleted={handleSceneDeleted}
        onSceneDuplicated={handleSceneDuplicated}
      />

      <CreateSceneDialog
        open={isCreateSceneOpen}
        onOpenChange={setIsCreateSceneOpen}
        onSceneCreated={handleSceneCreated}
        projectId={project.id}
        userId={userId}
      />
    </div>
  );
}
