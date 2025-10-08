// src/lib/schemas/project-schema.ts

import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .trim(),
  description: z
    .string()
    .max(200, "La descripción no puede exceder 200 caracteres")
    .trim()
    .nullable()
    .optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
