// src/components/aspire/scene/scene-list.tsx
"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SceneWithSimulations } from "@/lib/types/scene";
import { SceneCard } from "./scene-card";
import { SceneEmptyState } from "./scene-empty-state";

interface SceneListProps {
  scenes: SceneWithSimulations[];
  projectId: string;
  userId: string;
  onCreateScene: () => void;
  onSceneDeleted: (sceneId: string) => void;
  onSceneDuplicated: (scene: SceneWithSimulations) => void;
}

export function SceneList({
  scenes,
  projectId,
  userId,
  onCreateScene,
  onSceneDeleted,
  onSceneDuplicated,
}: SceneListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScenes = scenes.filter((scene) =>
    scene.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar una escena..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Button onClick={onCreateScene} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nueva escena
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {filteredScenes.length === 0 ? (
          <SceneEmptyState
            hasScenes={scenes.length > 0}
            onCreateScene={onCreateScene}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredScenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                projectId={projectId}
                userId={userId}
                onDelete={onSceneDeleted}
                onDuplicate={onSceneDuplicated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
