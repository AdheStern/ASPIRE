// src/components/aspire/simulation/panels/right-panel.tsx

"use client";

/**
 * Panel derecho del editor
 * Tabs: Propiedades del speaker | Materiales acústicos
 */

import { Palette, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  FaceMaterial,
  FaceMaterialsMap,
  FaceType,
  Speaker3DData,
} from "@/lib/three/types/editor.types";
import {
  getSpeakerDimensions,
  getSpeakerName,
} from "@/lib/three/utils/speaker-helpers";
import { MaterialSelector } from "../sections/material-selector";

interface RightPanelProps {
  selectedSpeaker: Speaker3DData | null;
  faceMaterials: FaceMaterialsMap;
  onUpdateFaceMaterial: (face: FaceType, material: FaceMaterial) => void;
  getFaceMaterial: (face: string) => FaceMaterial;
  selectedFace?: FaceType | null;
  materials?: Array<{
    id: string;
    name: string;
    description?: string | null;
    absorptionCoefficients: Record<string, number>;
  }>;
}

export function RightPanel({
  selectedSpeaker,
  faceMaterials,
  onUpdateFaceMaterial,
  selectedFace = null,
  materials = [],
}: RightPanelProps) {
  return (
    <div className="w-80 border-l bg-background flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="properties" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 h-12 rounded-none shrink-0">
          <TabsTrigger value="properties" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Propiedades
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <Palette className="h-4 w-4" />
            Materiales
          </TabsTrigger>
        </TabsList>

        {/* Tab: Propiedades */}
        <TabsContent
          value="properties"
          className="flex-1 overflow-y-auto p-6 mt-0 space-y-6"
        >
          {selectedSpeaker ? (
            <SpeakerProperties speaker={selectedSpeaker} />
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Propiedades</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona un speaker para ver sus propiedades
              </p>
            </div>
          )}
        </TabsContent>

        {/* Tab: Materiales */}
        <TabsContent
          value="materials"
          className="flex-1 overflow-y-auto p-6 mt-0"
        >
          <MaterialSelector
            selectedFace={selectedFace}
            faceMaterials={faceMaterials}
            onMaterialSelect={onUpdateFaceMaterial}
            materials={materials}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente interno para las propiedades del speaker
function SpeakerProperties({ speaker }: { speaker: Speaker3DData }) {
  const dimensions = getSpeakerDimensions(speaker);
  const speakerName = getSpeakerName(speaker); // ✅ Usar la función helper

  return (
    <div className="space-y-6">
      {/* Información del Speaker */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Speaker Seleccionado</h3>
          <p className="text-xs text-muted-foreground font-mono">
            {speaker.id}
          </p>
        </div>

        <Separator />

        {/* Posición */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Posición (metros)
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground/70">X</Label>
              <Input
                type="number"
                step="0.1"
                value={speaker.position[0].toFixed(2)}
                disabled
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground/70">Y</Label>
              <Input
                type="number"
                step="0.1"
                value={speaker.position[1].toFixed(2)}
                disabled
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground/70">Z</Label>
              <Input
                type="number"
                step="0.1"
                value={speaker.position[2].toFixed(2)}
                disabled
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Rotación */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Rotación (grados)
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground/70">X</Label>
              <Input
                type="number"
                value={((speaker.rotation[0] * 180) / Math.PI).toFixed(1)}
                disabled
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground/70">Y</Label>
              <Input
                type="number"
                value={((speaker.rotation[1] * 180) / Math.PI).toFixed(1)}
                disabled
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground/70">Z</Label>
              <Input
                type="number"
                value={((speaker.rotation[2] * 180) / Math.PI).toFixed(1)}
                disabled
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Especificaciones */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground">
            Especificaciones
          </Label>

          <div className="space-y-2 text-xs">
            {/* Modelo del speaker - NUEVO */}
            <div className="flex justify-between py-1 bg-primary/10 px-2 rounded">
              <span className="text-muted-foreground font-semibold">
                Modelo:
              </span>
              <span className="font-mono font-bold text-primary">
                {speakerName}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Dimensiones:</span>
              <span className="font-mono text-right">
                {speaker.specifications.dimensions_mm.width} ×{" "}
                {speaker.specifications.dimensions_mm.height} ×{" "}
                {speaker.specifications.dimensions_mm.depth} mm
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Dispersión:</span>
              <span className="font-mono">
                {typeof speaker.specifications.dispersion.horizontal ===
                "string"
                  ? speaker.specifications.dispersion.horizontal
                  : `${speaker.specifications.dispersion.horizontal}°`}{" "}
                ×{" "}
                {typeof speaker.specifications.dispersion.vertical === "string"
                  ? speaker.specifications.dispersion.vertical
                  : `${speaker.specifications.dispersion.vertical}°`}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">SPL Máximo:</span>
              <span className="font-mono">
                {speaker.specifications.max_spl_db} dB
              </span>
            </div>

            {speaker.specifications.frequencyRange_minus_3_db && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Respuesta (-3dB):</span>
                <span className="font-mono text-right">
                  {speaker.specifications.frequencyRange_minus_3_db}
                </span>
              </div>
            )}

            {speaker.specifications.type && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-mono text-right text-xs">
                  {speaker.specifications.type}
                </span>
              </div>
            )}

            {speaker.specifications.weight_kg && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Peso:</span>
                <span className="font-mono">
                  {speaker.specifications.weight_kg} kg
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dimensiones en metros (3D) */}
        <div className="p-3 bg-muted/50 rounded-md">
          <div className="text-[10px] text-muted-foreground mb-1">
            Tamaño en escena 3D:
          </div>
          <div className="text-xs font-mono">
            {dimensions.width.toFixed(3)} × {dimensions.height.toFixed(3)} ×{" "}
            {dimensions.depth.toFixed(3)} m
          </div>
        </div>
      </div>
    </div>
  );
}
