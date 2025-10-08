// src/components/aspire/scene/forms/create-scene-dialog.tsx
"use client";

import { CreateSceneForm } from "@/components/aspire/scene/forms/create-scene-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SceneWithSimulations } from "@/lib/types/scene";

interface CreateSceneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSceneCreated: (scene: SceneWithSimulations) => void;
  projectId: string;
  userId: string;
}

export function CreateSceneDialog({
  open,
  onOpenChange,
  onSceneCreated,
  projectId,
  userId,
}: CreateSceneDialogProps) {
  const handleSuccess = (scene: SceneWithSimulations) => {
    onSceneCreated(scene);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva escena</DialogTitle>
          <DialogDescription>
            Las escenas te permiten probar diferentes configuraciones acústicas
            del mismo espacio.
          </DialogDescription>
        </DialogHeader>

        <CreateSceneForm
          projectId={projectId}
          userId={userId}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
