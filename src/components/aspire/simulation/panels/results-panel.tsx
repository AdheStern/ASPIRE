// src/components/aspire/simulation/panels/results-panel.tsx

"use client";

/**
 * Panel de resultados de simulación acústica
 * Muestra RT60, métricas y clasificación de la habitación
 */

import { AlertCircle, CheckCircle, Download, X, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { RT60SimulationResponse } from "@/lib/api/types/simulation";

interface ResultsPanelProps {
  results: RT60SimulationResponse;
  onClose: () => void;
}

export function ResultsPanel({ results, onClose }: ResultsPanelProps) {
  const { status, metadata, results: rt60Results, error_message } = results;

  // Si hay error
  if (status === "error") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
              <XCircle className="h-6 w-6" />
              Error en Simulación
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error_message}</AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Si no hay resultados
  if (!rt60Results) {
    return null;
  }

  const { rt60_by_band, average_rt60 } = rt60Results;

  // Clasificación acústica para iglesias
  const getAcousticClassification = (rt60: number) => {
    if (rt60 < 1.0) {
      return {
        label: "Muy Seco",
        description: "Demasiada absorción. Sonido poco envolvente.",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: XCircle,
      };
    }
    if (rt60 >= 1.0 && rt60 < 1.5) {
      return {
        label: "Moderadamente Seco",
        description: "Buena inteligibilidad pero poca calidez.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: AlertCircle,
      };
    }
    if (rt60 >= 1.5 && rt60 <= 2.5) {
      return {
        label: "Óptimo para Iglesias",
        description: "Balance perfecto entre claridad y ambiente litúrgico.",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: CheckCircle,
      };
    }
    if (rt60 > 2.5 && rt60 <= 3.5) {
      return {
        label: "Reverberante",
        description: "Ambiente cálido pero puede afectar inteligibilidad.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: AlertCircle,
      };
    }
    return {
      label: "Muy Reverberante",
      description: "Excesiva reverberación. Dificulta comprensión verbal.",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: XCircle,
    };
  };

  const classification = getAcousticClassification(average_rt60);
  const ClassificationIcon = classification.icon;

  // Convertir bandas a array ordenado
  const bands = Object.entries(rt60_by_band)
    .map(([freq, rt60]) => ({
      freq: Number.parseInt(freq),
      rt60: rt60,
    }))
    .sort((a, b) => a.freq - b.freq);

  // Calcular altura máxima para normalizar las barras
  const maxRT60 = Math.max(...bands.map((b) => b.rt60), 3.0);

  // Exportar resultados
  const handleExport = () => {
    const data = {
      timestamp: metadata.timestamp,
      simulation_type: metadata.engine_used,
      average_rt60: average_rt60,
      rt60_by_band: rt60_by_band,
      classification: classification.label,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulation-${metadata.simulation_id || "results"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <Card className="w-full max-w-4xl p-6 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Resultados de Simulación RT60
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Motor: {metadata.engine_used} • Tiempo:{" "}
              {metadata.execution_time_seconds.toFixed(2)}s
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Promedio RT60 destacado */}
        <Card className={`p-6 ${classification.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ClassificationIcon
                className={`h-12 w-12 ${classification.color}`}
              />
              <div>
                <div className="text-sm text-muted-foreground">
                  Tiempo de Reverberación Promedio
                </div>
                <div className={`text-4xl font-bold ${classification.color}`}>
                  {average_rt60.toFixed(2)}s
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${classification.color}`}>
                {classification.label}
              </div>
              <div className="text-sm text-muted-foreground max-w-xs">
                {classification.description}
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfica de barras RT60 por frecuencia */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            RT60 por Banda de Frecuencia
          </Label>

          <div className="space-y-3">
            {bands.map((band) => {
              const percentage = (band.rt60 / maxRT60) * 100;
              const isOptimal = band.rt60 >= 1.5 && band.rt60 <= 2.5;

              return (
                <div key={band.freq} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono font-medium w-20">
                      {band.freq >= 1000
                        ? `${band.freq / 1000}k Hz`
                        : `${band.freq} Hz`}
                    </span>
                    <span
                      className={`font-bold ${
                        isOptimal ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      {band.rt60.toFixed(2)}s
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  <div className="h-8 bg-muted rounded-md overflow-hidden relative">
                    <div
                      className={`h-full transition-all ${
                        isOptimal
                          ? "bg-green-500"
                          : band.rt60 < 1.5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />

                    {/* Zona óptima (1.5s - 2.5s) */}
                    <div
                      className="absolute top-0 h-full border-l-2 border-r-2 border-green-600 border-dashed opacity-30"
                      style={{
                        left: `${(1.5 / maxRT60) * 100}%`,
                        width: `${((2.5 - 1.5) / maxRT60) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>Óptimo (1.5-2.5s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded" />
              <span>Moderado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span>Fuera de rango</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Recomendaciones */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Recomendaciones</Label>

          <div className="space-y-2">
            {average_rt60 < 1.5 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Aumentar reverberación:</strong> Considera reducir
                  materiales absorbentes o agregar superficies reflectantes.
                </AlertDescription>
              </Alert>
            )}

            {average_rt60 > 2.5 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Reducir reverberación:</strong> Agrega paneles
                  acústicos, cortinas o alfombras para mejorar inteligibilidad.
                </AlertDescription>
              </Alert>
            )}

            {average_rt60 >= 1.5 && average_rt60 <= 2.5 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Acústica óptima:</strong> El tiempo de reverberación
                  es ideal para actividades litúrgicas con buena inteligibilidad
                  y ambiente apropiado.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Separator />

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">
              ID de Simulación
            </Label>
            <div className="font-mono text-xs">
              {metadata.simulation_id || "N/A"}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Fecha</Label>
            <div className="text-xs">
              {new Date(metadata.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
