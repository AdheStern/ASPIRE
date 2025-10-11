// src/components/aspire/simulation/panels/status-bar.tsx

"use client";

/**
 * Barra de estado inferior del editor
 * Muestra información contextual y atajos de teclado
 */

import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/three/types/editor.types";

interface StatusBarProps {
  selectedTool: Tool;
  showGrid: boolean;
}

const toolShortcuts: Record<Tool, string> = {
  select: "Q",
  move: "W",
  rotate: "E",
};

const toolLabels: Record<Tool, string> = {
  select: "Seleccionar",
  move: "Mover",
  rotate: "Rotar",
};

export function StatusBar({ selectedTool, showGrid }: StatusBarProps) {
  return (
    <div className="h-8 border-t bg-background flex items-center justify-between px-4 text-xs">
      {/* Lado izquierdo: Info de la herramienta */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Herramienta:</span>
          <Badge variant="secondary" className="text-xs">
            {toolLabels[selectedTool]} ({toolShortcuts[selectedTool]})
          </Badge>
        </div>

        {selectedTool !== "select" && (
          <span className="text-muted-foreground">
            Arrastra el gizmo para transformar el speaker
          </span>
        )}
      </div>

      {/* Centro: Tips */}
      <div className="flex items-center gap-4 text-muted-foreground">
        <span>Click para seleccionar</span>
        <span>•</span>
        <span>Scroll para zoom</span>
        <span>•</span>
        <span>Click derecho para rotar cámara</span>
      </div>

      {/* Lado derecho: Estado del grid */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Grid:</span>
        <Badge variant={showGrid ? "default" : "outline"} className="text-xs">
          {showGrid ? "Visible" : "Oculto"}
        </Badge>
      </div>
    </div>
  );
}
