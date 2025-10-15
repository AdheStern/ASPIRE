// src/lib/api/services/simulation.ts

/**
 * Servicio para la API de simulación acústica
 */

import { apiClient } from "../client";
import type {
  RT60SimulationRequest,
  RT60SimulationResponse,
  SimulationType,
} from "../types/simulation";

/**
 * Ejecuta una simulación RT60
 * @param request - Datos de la simulación (en formato backend)
 * @returns Resultados de la simulación
 */
export async function runRT60Simulation(
  request: RT60SimulationRequest
): Promise<RT60SimulationResponse> {
  try {
    console.log("🚀 Enviando request de simulación al backend...");
    console.log("Request:", JSON.stringify(request, null, 2));

    const response = await apiClient.post<RT60SimulationResponse>(
      "/api/v1/simulate/rt60",
      request
    );

    console.log("✅ Simulación completada:", response);
    return response;
  } catch (error) {
    console.error("❌ Error en simulación RT60:", error);
    throw error;
  }
}

/**
 * Verifica el estado del servidor de simulación
 */
export async function checkSimulationHealth(): Promise<{
  status: string;
  version: string;
}> {
  try {
    const response = await apiClient.get<{
      status: string;
      version: string;
    }>("health");
    return response;
  } catch (error) {
    console.error("❌ Error verificando salud del servidor:", error);
    throw error;
  }
}

/**
 * Obtiene información sobre los tipos de simulación disponibles
 */
export function getAvailableSimulationTypes(): Array<{
  id: SimulationType;
  name: string;
  description: string;
}> {
  return [
    {
      id: "rt60_sabine",
      name: "RT60 Sabine",
      description: "Ecuación de Sabine para cálculo rápido de reverberación",
    },
    {
      id: "rt60_eyring",
      name: "RT60 Eyring",
      description: "Ecuación de Eyring para habitaciones con alta absorción",
    },
    {
      id: "rt60_ism",
      name: "RT60 ISM",
      description: "Image Source Method para simulación precisa",
    },
  ];
}
