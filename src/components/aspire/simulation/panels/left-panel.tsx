// src/components/aspire/simulation/panels/left-panel.tsx

"use client";

/**
 * Panel izquierdo del editor
 * Contiene: Controles de dimensiones de la habitación (sin Cards)
 */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { RoomDimensions, Tool } from "@/lib/three/types/editor.types";

interface LeftPanelProps {
  dimensions: RoomDimensions;
  onDimensionChange: (key: keyof RoomDimensions, value: number) => void;
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export function LeftPanel({
  dimensions,
  onDimensionChange,
  selectedTool,
}: LeftPanelProps) {
  const handleInputChange = (key: keyof RoomDimensions, value: string) => {
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue) && numValue > 0) {
      onDimensionChange(key, numValue);
    }
  };

  return (
    <div className="w-80 h-full border-r bg-background overflow-y-auto p-6 space-y-6">
      {/* Dimensiones de la Habitación */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Dimensiones</h3>
          <p className="text-xs text-muted-foreground">
            Configura el tamaño de la habitación
          </p>
        </div>

        <Separator />

        {/* Ancho */}
        <div className="space-y-2">
          <Label htmlFor="width" className="text-sm flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500" />
            Ancho (X)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="width"
              type="number"
              min="1"
              step="0.1"
              value={dimensions.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-6">m</span>
          </div>
        </div>

        {/* Altura */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500" />
            Altura (Y)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="height"
              type="number"
              min="1"
              step="0.1"
              value={dimensions.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-6">m</span>
          </div>
        </div>

        {/* Profundidad */}
        <div className="space-y-2">
          <Label htmlFor="depth" className="text-sm flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500" />
            Profundidad (Z)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="depth"
              type="number"
              min="1"
              step="0.1"
              value={dimensions.depth}
              onChange={(e) => handleInputChange("depth", e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-6">m</span>
          </div>
        </div>

        <Separator />

        {/* Info del volumen */}
        <div className="p-3 bg-muted/50 rounded-md space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Volumen:</span>
            <span className="font-mono font-medium">
              {(
                dimensions.width *
                dimensions.height *
                dimensions.depth
              ).toFixed(2)}{" "}
              m³
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Área de piso:</span>
            <span className="font-mono font-medium">
              {(dimensions.width * dimensions.depth).toFixed(2)} m²
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Info de herramienta actual */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Herramienta Activa</h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Actual:</span>
            <span className="font-medium capitalize px-2 py-1 bg-primary/10 rounded text-primary">
              {selectedTool}
            </span>
          </div>

          <div className="p-3 bg-muted/30 rounded-md">
            {selectedTool === "select" && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Click en un speaker para seleccionarlo. Usa{" "}
                <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px]">
                  W
                </kbd>{" "}
                /{" "}
                <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px]">
                  E
                </kbd>{" "}
                para cambiar de herramienta.
              </p>
            )}

            {selectedTool === "move" && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Arrastra los ejes para mover el speaker seleccionado en X, Y o
                Z.
              </p>
            )}

            {selectedTool === "rotate" && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Arrastra los círculos para rotar el speaker seleccionado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
