// src/components/aspire/project/forms/create-project-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProjectWithCount } from "@/lib/types/project";
import { CreateProjectForm } from "./create-project-form";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: ProjectWithCount) => void;
  userId: string;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
  userId,
}: CreateProjectDialogProps) {
  const handleSuccess = (project: ProjectWithCount) => {
    onProjectCreated(project);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo proyecto</DialogTitle>
          <DialogDescription>
            Los proyectos te ayudan a organizar tus simulaciones acústicas por
            templo o lugar.
          </DialogDescription>
        </DialogHeader>

        <CreateProjectForm
          userId={userId}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
