// src/components/aspire/simulation/sections/speaker-properties-panel.tsx

"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Speaker3DData } from "@/lib/three/types/editor.types";
import { getSpeakerName } from "@/lib/three/utils/speaker-helpers";

interface SpeakerPropertiesPanelProps {
  speaker: Speaker3DData | null;
}

export function SpeakerPropertiesPanel({
  speaker,
}: SpeakerPropertiesPanelProps) {
  if (!speaker) {
    return (
      <div className="text-center p-8 text-sm text-muted-foreground">
        <p>Selecciona un speaker para ver sus propiedades</p>
        <p className="text-xs mt-2">
          Usa la herramienta Select y haz click en un speaker
        </p>
      </div>
    );
  }

  const specs = speaker.specifications;
  const dims = specs.dimensions_mm;

  // Obtener el nombre del speaker
  const speakerName = getSpeakerName(speaker);

  // Formatear dispersión para mostrar
  const formatDispersion = (value: number | string) => {
    if (typeof value === "string") {
      return value;
    }
    return `${value}°`;
  };

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Speaker Seleccionado</h3>
        <p className="text-xs text-muted-foreground">{speaker.id}</p>
      </div>

      <Separator />

      {/* Nombre */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Nombre</Label>
        <div className="text-sm font-medium">{speakerName}</div>
      </div>

      <Separator />

      {/* Posición */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Posición (metros)
        </Label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">X</div>
            <div className="font-mono bg-muted/30 p-1.5 rounded">
              {speaker.position[0].toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Y</div>
            <div className="font-mono bg-muted/30 p-1.5 rounded">
              {speaker.position[1].toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Z</div>
            <div className="font-mono bg-muted/30 p-1.5 rounded">
              {speaker.position[2].toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Rotación */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Rotación (grados)
        </Label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">X</div>
            <div className="font-mono bg-muted/30 p-1.5 rounded">
              {((speaker.rotation[0] * 180) / Math.PI).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Y</div>
            <div className="font-mono bg-muted/30 p-1.5 rounded">
              {((speaker.rotation[1] * 180) / Math.PI).toFixed(0)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Z</div>
            <div className="font-mono bg-muted/30 p-1.5 rounded">
              {((speaker.rotation[2] * 180) / Math.PI).toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Especificaciones */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">
          Especificaciones
        </Label>

        {/* Dimensiones */}
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground">Dimensiones:</div>
          <div className="text-xs font-mono">
            {dims.width} × {dims.height} × {dims.depth} mm
          </div>
        </div>

        {/* Dispersión */}
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground">Dispersión:</div>
          <div className="text-xs font-mono">
            {formatDispersion(specs.dispersion.horizontal)} ×{" "}
            {formatDispersion(specs.dispersion.vertical)}
          </div>
        </div>

        {/* Tamaño en escena 3D */}
        <div className="space-y-1 p-2 bg-muted/30 rounded">
          <div className="text-[10px] text-muted-foreground">
            Tamaño en escena 3D:
          </div>
          <div className="text-xs font-mono text-green-400">
            {(dims.width * 0.001).toFixed(3)} ×{" "}
            {(dims.height * 0.001).toFixed(3)} ×{" "}
            {(dims.depth * 0.001).toFixed(3)} m
          </div>
        </div>
      </div>
    </div>
  );
}
