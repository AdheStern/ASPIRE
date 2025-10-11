"use client";

/**
 * Barra superior del editor 3D
 * Contiene: nombre del proyecto/escena, controles de vista, grid toggle
 */

import { ArrowLeft, Eye, Grid3x3, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import type { ViewMode } from "@/lib/three/types/editor.types";

interface HeaderBarProps {
  sceneName: string;
  projectName: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
}

export function HeaderBar({
  sceneName,
  projectName,
  viewMode,
  onViewModeChange,
  showGrid,
  onToggleGrid,
}: HeaderBarProps) {
  const router = useRouter();

  const viewModeLabels: Record<ViewMode, string> = {
    perspective: "Perspectiva",
    top: "Vista Superior",
    front: "Vista Frontal",
    side: "Vista Lateral",
  };

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4">
      {/* Lado izquierdo: Navegación y nombre */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{projectName}</span>
          <span className="text-sm font-medium">{sceneName}</span>
        </div>
      </div>

      {/* Centro: Controles de vista */}
      <div className="flex items-center gap-2">
        {/* Selector de modo de vista */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              {viewModeLabels[viewMode]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onViewModeChange("perspective")}>
              Perspectiva
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange("top")}>
              Vista Superior
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange("front")}>
              Vista Frontal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange("side")}>
              Vista Lateral
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Toggle Grid */}
        <Button
          variant={showGrid ? "default" : "outline"}
          size="sm"
          onClick={onToggleGrid}
          className="gap-2"
        >
          <Grid3x3 className="h-4 w-4" />
          Grid
        </Button>
      </div>

      {/* Lado derecho: Acciones */}
      <div className="flex items-center gap-2">
        <Button size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Guardar
        </Button>
      </div>
    </div>
  );
}
