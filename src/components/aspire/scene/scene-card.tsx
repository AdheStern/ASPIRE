// src/components/aspire/scene/scene-card.tsx
"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Copy,
  FlaskConical,
  MoreVertical,
  Play,
  Ruler,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteScene, duplicateScene } from "@/lib/actions/scene-actions";
import type { SceneWithSimulations } from "@/lib/types/scene";

interface SceneCardProps {
  scene: SceneWithSimulations;
  projectId: string;
  userId: string;
  onDelete: (sceneId: string) => void;
  onDuplicate: (scene: SceneWithSimulations) => void;
}

export function SceneCard({
  scene,
  projectId,
  userId,
  onDelete,
  onDuplicate,
}: SceneCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await deleteScene(scene.id, userId);

    if (result.success) {
      toast.success("Escena eliminada correctamente");
      onDelete(scene.id);
    } else {
      toast.error(result.error || "Error al eliminar la escena");
    }

    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);

    const result = await duplicateScene(scene.id, userId);

    if (result.success && result.data) {
      toast.success("Escena duplicada correctamente");
      onDuplicate(result.data as SceneWithSimulations);
    } else {
      toast.error(result.error || "Error al duplicar la escena");
    }

    setIsDuplicating(false);
  };

  const handleNavigate = () => {
    router.push(`/projects/${projectId}/scenes/${scene.id}`);
  };

  const formattedDate = formatDistanceToNow(new Date(scene.updatedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <>
      <Card
        className="group cursor-pointer transition-all hover:shadow-md"
        onClick={handleNavigate}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <FlaskConical className="h-5 w-5" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate();
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Abrir editor
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate();
                  }}
                  disabled={isDuplicating}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {isDuplicating ? "Duplicando..." : "Duplicar"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="line-clamp-1">{scene.name}</CardTitle>
          <CardDescription>Actualizada {formattedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {scene._count.simulationRuns > 0 && (
              <Badge variant="secondary">
                <FlaskConical className="mr-1 h-3 w-3" />
                {scene._count.simulationRuns} simulaciones
              </Badge>
            )}
            {scene._count.measurements > 0 && (
              <Badge variant="secondary">
                <Ruler className="mr-1 h-3 w-3" />
                {scene._count.measurements} mediciones
              </Badge>
            )}
            {scene._count.simulationRuns === 0 &&
              scene._count.measurements === 0 && (
                <Badge variant="outline">Sin datos</Badge>
              )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar escena?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la escena
              <span className="font-semibold"> &quot;{scene.name}&quot; </span>y
              todos sus datos asociados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
