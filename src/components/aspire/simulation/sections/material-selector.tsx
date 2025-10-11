// src/components/aspire/simulation/sections/material-selector.tsx

"use client";

/**
 * Selector de materiales acústicos para caras de la habitación
 * Muestra grid con coeficientes por banda de frecuencia
 */

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FACE_NAMES } from "@/lib/three/constants/editor.constants";
import type { FaceMaterial, FaceType } from "@/lib/three/types/editor.types";

// Interfaz que coincide EXACTAMENTE con lo que viene de la BD
interface Material {
  id: string;
  name: string;
  description?: string | null;
  absorptionCoefficients: Record<string, number>;
}

interface MaterialSelectorProps {
  selectedFace: FaceType | null;
  faceMaterials: Record<FaceType, FaceMaterial>;
  onMaterialSelect: (face: FaceType, material: FaceMaterial) => void;
  materials: Material[];
}

export function MaterialSelector({
  selectedFace,
  faceMaterials,
  onMaterialSelect,
  materials,
}: MaterialSelectorProps) {
  // Función para calcular el NRC (Noise Reduction Coefficient)
  // Es el promedio de los coeficientes de 250Hz, 500Hz, 1kHz y 2kHz
  const calculateNRC = (coefficients: Record<string, number>) => {
    if (!coefficients) {
      console.error("⚠️ calculateNRC: coefficients is undefined");
      return 0;
    }

    // Usar las claves tal como vienen de la BD
    const values = [
      coefficients["250"] || 0,
      coefficients["500"] || 0,
      coefficients["1k"] || 0,
      coefficients["2k"] || 0,
    ];

    return values.reduce((a, b) => a + b, 0) / 4;
  };

  // Función para obtener color según el coeficiente
  const getColorForCoefficient = (coef: number) => {
    if (coef < 0.2) return "text-red-600";
    if (coef < 0.5) return "text-yellow-600";
    return "text-green-600";
  };

  // Función para obtener background según el coeficiente
  const getBgForCoefficient = (coef: number) => {
    if (coef < 0.2) return "bg-red-500/20";
    if (coef < 0.5) return "bg-yellow-500/20";
    return "bg-green-500/20";
  };

  if (!selectedFace) {
    return (
      <div className="space-y-4">
        <div className="text-center p-8 text-sm text-muted-foreground">
          <p>
            Selecciona una cara de la habitación para asignar un material
            acústico
          </p>
          <p className="text-xs mt-2">
            Cambia a modo Geometría y haz click en una cara
          </p>
        </div>

        {/* Mostrar materiales actuales de todas las caras */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Materiales asignados
          </Label>
          {Object.entries(FACE_NAMES).map(([faceKey, faceName]) => {
            const face = faceKey as FaceType;
            const material = faceMaterials[face];
            const isDefault = material.materialId === "default";

            return (
              <div
                key={face}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-xs"
              >
                <span className="font-medium">{faceName}</span>
                <span
                  className={
                    isDefault
                      ? "text-muted-foreground"
                      : "text-green-600 font-medium"
                  }
                >
                  {isDefault
                    ? "Sin material"
                    : `α = ${material.absorptionCoefficient.toFixed(2)}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentMaterial = faceMaterials[selectedFace];
  const selectedMaterialData = materials.find(
    (m) => m.id === currentMaterial.materialId
  );

  const handleMaterialChange = (materialId: string) => {
    if (materialId === "default") {
      onMaterialSelect(selectedFace, {
        materialId: "default",
        absorptionCoefficient: 0.1,
      });
    } else {
      const material = materials.find((m) => m.id === materialId);

      if (material) {
        // Validar que absorptionCoefficients existe
        if (!material.absorptionCoefficients) {
          console.error("❌ Material sin coeficientes:", material);
          return;
        }

        const nrc = calculateNRC(material.absorptionCoefficients);
        onMaterialSelect(selectedFace, {
          materialId: material.id,
          absorptionCoefficient: nrc,
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <h3 className="text-sm font-semibold mb-1">
          Material para {FACE_NAMES[selectedFace]}
        </h3>
        <p className="text-xs text-muted-foreground">
          Selecciona un material acústico
        </p>
      </div>

      <Separator />

      {/* Select de material */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Material</Label>
        <Select
          value={currentMaterial.materialId}
          onValueChange={handleMaterialChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">
              <span className="text-muted-foreground">
                Sin material (default)
              </span>
            </SelectItem>
            {materials.map((material) => (
              <SelectItem key={material.id} value={material.id}>
                {material.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Propiedades del material seleccionado */}
      {selectedMaterialData && (
        <>
          <Separator />

          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Material seleccionado
                </Label>
                <div className="text-sm font-medium mt-1">
                  {selectedMaterialData.name}
                </div>
              </div>

              {selectedMaterialData.description && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Descripción
                  </Label>
                  <p className="text-xs mt-1 text-muted-foreground leading-relaxed">
                    {selectedMaterialData.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Coeficiente promedio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Promedio (NRC)
                  </Label>
                  <span
                    className={`font-mono text-base font-bold ${getColorForCoefficient(
                      calculateNRC(selectedMaterialData.absorptionCoefficients)
                    )}`}
                  >
                    α ={" "}
                    {calculateNRC(
                      selectedMaterialData.absorptionCoefficients
                    ).toFixed(2)}
                  </span>
                </div>

                {/* Barra visual del coeficiente promedio */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all"
                    style={{
                      width: `${
                        calculateNRC(
                          selectedMaterialData.absorptionCoefficients
                        ) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Reflectivo</span>
                  <span>Absorbente</span>
                </div>

                {/* Interpretación del promedio */}
                <div className="p-2 bg-background/50 rounded text-xs flex items-center gap-2">
                  {calculateNRC(selectedMaterialData.absorptionCoefficients) <
                    0.2 && (
                    <>
                      <span className="text-red-600 text-base">⚠️</span>
                      <span className="text-red-600">
                        Material muy reflectivo - Posible reverberación
                      </span>
                    </>
                  )}
                  {calculateNRC(selectedMaterialData.absorptionCoefficients) >=
                    0.2 &&
                    calculateNRC(selectedMaterialData.absorptionCoefficients) <
                      0.5 && (
                      <>
                        <span className="text-yellow-600 text-base">✓</span>
                        <span className="text-yellow-600">
                          Absorción moderada
                        </span>
                      </>
                    )}
                  {calculateNRC(selectedMaterialData.absorptionCoefficients) >=
                    0.5 && (
                    <>
                      <span className="text-green-600 text-base">✓</span>
                      <span className="text-green-600">
                        Excelente absorción acústica
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Grid de coeficientes por banda de frecuencia - 2 columnas x 3 filas */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Coeficientes por banda de frecuencia
                </Label>

                <div className="grid grid-cols-2 gap-2">
                  {/* 125 Hz */}
                  {selectedMaterialData.absorptionCoefficients["125"] !==
                    undefined && (
                    <Card
                      className={`p-2 ${getBgForCoefficient(
                        selectedMaterialData.absorptionCoefficients["125"]
                      )} border-none`}
                    >
                      <div className="text-[9px] font-medium text-muted-foreground uppercase">
                        125 Hz
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${getColorForCoefficient(
                          selectedMaterialData.absorptionCoefficients["125"]
                        )}`}
                      >
                        {selectedMaterialData.absorptionCoefficients[
                          "125"
                        ].toFixed(2)}
                      </div>
                    </Card>
                  )}

                  {/* 250 Hz */}
                  {selectedMaterialData.absorptionCoefficients["250"] !==
                    undefined && (
                    <Card
                      className={`p-2 ${getBgForCoefficient(
                        selectedMaterialData.absorptionCoefficients["250"]
                      )} border-none`}
                    >
                      <div className="text-[9px] font-medium text-muted-foreground uppercase">
                        250 Hz
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${getColorForCoefficient(
                          selectedMaterialData.absorptionCoefficients["250"]
                        )}`}
                      >
                        {selectedMaterialData.absorptionCoefficients[
                          "250"
                        ].toFixed(2)}
                      </div>
                    </Card>
                  )}

                  {/* 500 Hz */}
                  {selectedMaterialData.absorptionCoefficients["500"] !==
                    undefined && (
                    <Card
                      className={`p-2 ${getBgForCoefficient(
                        selectedMaterialData.absorptionCoefficients["500"]
                      )} border-none`}
                    >
                      <div className="text-[9px] font-medium text-muted-foreground uppercase">
                        500 Hz
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${getColorForCoefficient(
                          selectedMaterialData.absorptionCoefficients["500"]
                        )}`}
                      >
                        {selectedMaterialData.absorptionCoefficients[
                          "500"
                        ].toFixed(2)}
                      </div>
                    </Card>
                  )}

                  {/* 1000 Hz */}
                  {selectedMaterialData.absorptionCoefficients["1k"] !==
                    undefined && (
                    <Card
                      className={`p-2 ${getBgForCoefficient(
                        selectedMaterialData.absorptionCoefficients["1k"]
                      )} border-none`}
                    >
                      <div className="text-[9px] font-medium text-muted-foreground uppercase">
                        1 kHz
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${getColorForCoefficient(
                          selectedMaterialData.absorptionCoefficients["1k"]
                        )}`}
                      >
                        {selectedMaterialData.absorptionCoefficients[
                          "1k"
                        ].toFixed(2)}
                      </div>
                    </Card>
                  )}

                  {/* 2000 Hz */}
                  {selectedMaterialData.absorptionCoefficients["2k"] !==
                    undefined && (
                    <Card
                      className={`p-2 ${getBgForCoefficient(
                        selectedMaterialData.absorptionCoefficients["2k"]
                      )} border-none`}
                    >
                      <div className="text-[9px] font-medium text-muted-foreground uppercase">
                        2 kHz
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${getColorForCoefficient(
                          selectedMaterialData.absorptionCoefficients["2k"]
                        )}`}
                      >
                        {selectedMaterialData.absorptionCoefficients[
                          "2k"
                        ].toFixed(2)}
                      </div>
                    </Card>
                  )}

                  {/* 4000 Hz */}
                  {selectedMaterialData.absorptionCoefficients["4k"] !==
                    undefined && (
                    <Card
                      className={`p-2 ${getBgForCoefficient(
                        selectedMaterialData.absorptionCoefficients["4k"]
                      )} border-none`}
                    >
                      <div className="text-[9px] font-medium text-muted-foreground uppercase">
                        4 kHz
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${getColorForCoefficient(
                          selectedMaterialData.absorptionCoefficients["4k"]
                        )}`}
                      >
                        {selectedMaterialData.absorptionCoefficients[
                          "4k"
                        ].toFixed(2)}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Leyenda de colores más compacta */}
                <div className="flex items-center justify-center gap-3 text-[9px] text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>&lt;0.20</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span>0.20-0.50</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>&gt;0.50</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {currentMaterial.materialId === "default" && (
        <Card className="p-3 bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Esta cara no tiene un material asignado. Selecciona un material de
            la lista para mejorar la acústica.
          </p>
        </Card>
      )}
    </div>
  );
}
