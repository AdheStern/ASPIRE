// src/components/aspire/simulation/panels/right-panel.tsx

"use client";

/**
 * Panel derecho del editor
 * Tabs: Propiedades del speaker | Materiales acústicos | Simulación
 */

import { AlertCircle, Palette, Play, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SimulationType } from "@/lib/api/types/simulation";
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
  selectedFace?: FaceType | null;
  materials?: Array<{
    id: string;
    name: string;
    description?: string | null;
    absorptionCoefficients: Record<string, number>;
  }>;
  // Props para simulación
  onRunSimulation?: (simulationType: SimulationType) => Promise<void>;
  isSimulating?: boolean;
  simulationError?: string | null;
  totalSpeakers?: number;
}

export function RightPanel({
  selectedSpeaker,
  faceMaterials,
  onUpdateFaceMaterial,
  selectedFace = null,
  materials = [],
  onRunSimulation,
  isSimulating = false,
  simulationError = null,
  totalSpeakers = 0,
}: RightPanelProps) {
  return (
    <div className="w-80 border-l flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="properties" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-3 h-12 rounded-none shrink-0">
          <TabsTrigger value="properties" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden xl:inline">Propiedades</span>
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden xl:inline">Materiales</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="gap-2">
            <Play className="h-4 w-4" />
            <span className="hidden xl:inline">Simulación</span>
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

        {/* Tab: Simulación */}
        <TabsContent
          value="simulation"
          className="flex-1 overflow-y-auto p-6 mt-0"
        >
          <SimulationControls
            faceMaterials={faceMaterials}
            totalSpeakers={totalSpeakers}
            onRunSimulation={onRunSimulation}
            isSimulating={isSimulating}
            simulationError={simulationError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================================
// COMPONENTE: Controles de Simulación
// ============================================================================

interface SimulationControlsProps {
  faceMaterials: FaceMaterialsMap;
  totalSpeakers: number;
  onRunSimulation?: (simulationType: SimulationType) => Promise<void>;
  isSimulating: boolean;
  simulationError: string | null;
}

function SimulationControls({
  faceMaterials,
  totalSpeakers,
  onRunSimulation,
  isSimulating,
  simulationError,
}: SimulationControlsProps) {
  const [simulationType, setSimulationType] =
    useState<SimulationType>("rt60_sabine");

  // Verificar si hay materiales asignados
  const assignedMaterials = Object.values(faceMaterials).filter(
    (mat) => mat.materialId !== "default"
  ).length;

  const hasAllMaterials = assignedMaterials === 6;
  const canSimulate = totalSpeakers > 0 && !isSimulating;

  const handleRunSimulation = async () => {
    if (!onRunSimulation || !canSimulate) return;
    await onRunSimulation(simulationType);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h3 className="text-sm font-semibold mb-1">Ejecutar Simulación</h3>
        <p className="text-xs text-muted-foreground">
          Calcula el tiempo de reverberación RT60 de la habitación
        </p>
      </div>

      <Separator />

      {/* Estado de la configuración */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">
          Estado de configuración
        </Label>

        <div className="space-y-2">
          {/* Speakers */}
          <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
            <span className="text-xs">Speakers configurados</span>
            <span
              className={`text-xs font-bold ${
                totalSpeakers > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalSpeakers > 0 ? `✓ ${totalSpeakers}` : "✗ 0"}
            </span>
          </div>

          {/* Materiales */}
          <div className="flex items-center justify-between p-2 rounded-md bg-muted/30">
            <span className="text-xs">Materiales asignados</span>
            <span
              className={`text-xs font-bold ${
                hasAllMaterials
                  ? "text-green-600"
                  : assignedMaterials > 0
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {assignedMaterials}/6
            </span>
          </div>
        </div>

        {/* Advertencia si faltan materiales */}
        {!hasAllMaterials && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {assignedMaterials === 0
                ? "No hay materiales asignados. Se usarán valores por defecto."
                : `Faltan ${6 - assignedMaterials} caras por asignar material.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Error de speakers */}
        {totalSpeakers === 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Debes agregar al menos un speaker para simular.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Separator />

      {/* Selector de tipo de simulación */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Tipo de simulación
        </Label>
        <Select
          value={simulationType}
          onValueChange={(value) => setSimulationType(value as SimulationType)}
          disabled={isSimulating}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rt60_sabine">
              <div className="flex flex-col items-start">
                <span className="font-medium">Sabine</span>
                <span className="text-xs text-muted-foreground">
                  Cálculo rápido
                </span>
              </div>
            </SelectItem>
            <SelectItem value="rt60_eyring">
              <div className="flex flex-col items-start">
                <span className="font-medium">Eyring</span>
                <span className="text-xs text-muted-foreground">
                  Alta absorción
                </span>
              </div>
            </SelectItem>
            <SelectItem value="rt60_ism">
              <div className="flex flex-col items-start">
                <span className="font-medium">ISM</span>
                <span className="text-xs text-muted-foreground">
                  Más preciso (lento)
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Descripción del método seleccionado */}
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground">
            {simulationType === "rt60_sabine" &&
              "Ecuación de Sabine: método clásico para habitaciones con distribución uniforme de absorción."}
            {simulationType === "rt60_eyring" &&
              "Ecuación de Eyring: más preciso para habitaciones con alta absorción acústica."}
            {simulationType === "rt60_ism" &&
              "Image Source Method: simula reflexiones de sonido para mayor precisión (más lento)."}
          </p>
        </div>
      </div>

      <Separator />

      {/* Botón de ejecutar */}
      <div className="space-y-3">
        <Button
          onClick={handleRunSimulation}
          disabled={!canSimulate}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {isSimulating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Simulando...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Ejecutar Simulación
            </>
          )}
        </Button>

        {/* Error de simulación */}
        {simulationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {simulationError}
            </AlertDescription>
          </Alert>
        )}

        {/* Info adicional */}
        <p className="text-xs text-muted-foreground text-center">
          La simulación puede tomar unos segundos
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE: Propiedades del Speaker
// ============================================================================

function SpeakerProperties({ speaker }: { speaker: Speaker3DData }) {
  const dimensions = getSpeakerDimensions(speaker);
  const speakerName = getSpeakerName(speaker);

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
            {/* Modelo del speaker */}
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
