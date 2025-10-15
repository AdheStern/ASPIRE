// src/lib/api/client.ts

/**
 * Cliente HTTP base para la API de simulación
 * Wrapper sobre fetch con configuración centralizada
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SIMULATION_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Realiza una petición HTTP genérica
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Si no es OK (200-299), lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP Error ${response.status}`,
          response.status,
          errorData
        );
      }

      // Parsear respuesta JSON
      const data = await response.json();
      return data as T;
    } catch (error) {
      // Re-lanzar ApiError tal cual
      if (error instanceof ApiError) {
        throw error;
      }

      // Errores de red o de fetch
      throw new ApiError(
        error instanceof Error ? error.message : "Error de red",
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

// Instancia singleton del cliente
export const apiClient = new ApiClient();
