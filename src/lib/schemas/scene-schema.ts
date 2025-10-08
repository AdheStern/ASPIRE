// src/lib/schemas/scene-schema.ts

import { z } from "zod";

export const sceneSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim(),
});

export const RoomDimensionsSchema = z.object({
  width: z.coerce.number().min(1, "El ancho debe ser al menos 1 metro."),
  depth: z.coerce.number().min(1, "La profundidad debe ser al menos 1 metro."),
  height: z.coerce.number().min(1, "La altura debe ser al menos 1 metro."),
});

export const sceneUpdateSchema = sceneSchema.partial();
export type RoomDimensionsFormData = z.infer<typeof RoomDimensionsSchema>;
export type SceneFormData = z.infer<typeof sceneSchema>;
