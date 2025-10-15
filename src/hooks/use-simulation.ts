// src/hooks/use-simulation.ts

/**
 * Hook para ejecutar simulaciones acústicas
 * Maneja el estado de loading, errores y resultados
 */

import { useState } from "react";
import { runRT60Simulation } from "@/lib/api/services/simulation";
import {
  editorStateToSimulationRequest,
  getSimulationSummary,
  transformToBackendRequest,
  validateSimulationRequest,
} from "@/lib/api/transformers/scene-to-request";
import type {
  RT60SimulationResponse,
  SimulationType,
} from "@/lib/api/types/simulation";
import type { EditorState } from "@/lib/three/types/editor.types";

interface UseSimulationReturn {
  // Estado
  isLoading: boolean;
  error: string | null;
  results: RT60SimulationResponse | null;

  // Acciones
  runSimulation: (
    editorState: EditorState,
    simulationType?: SimulationType
  ) => Promise<void>;
  reset: () => void;
}

export function useSimulation(): UseSimulationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RT60SimulationResponse | null>(null);

  const runSimulation = async (
    editorState: EditorState,
    simulationType: SimulationType = "rt60_sabine"
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      setResults(null);

      // 1. Convertir estado del editor a formato frontend
      const frontendRequest = editorStateToSimulationRequest(editorState);

      // 2. Validar request
      const validation = validateSimulationRequest(frontendRequest);
      if (!validation.valid) {
        throw new Error(`Request inválido:\n${validation.errors.join("\n")}`);
      }

      // 3. Mostrar resumen en consola
      console.log(getSimulationSummary(frontendRequest));

      // 4. Transformar a formato del backend
      const backendRequest = transformToBackendRequest(
        frontendRequest,
        simulationType
      );

      // 5. Ejecutar simulación
      const response = await runRT60Simulation(backendRequest);

      // 6. Verificar respuesta
      if (response.status === "error") {
        throw new Error(
          response.error_message || "Error desconocido en la simulación"
        );
      }

      setResults(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("❌ Error en simulación:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setResults(null);
  };

  return {
    isLoading,
    error,
    results,
    runSimulation,
    reset,
  };
}
