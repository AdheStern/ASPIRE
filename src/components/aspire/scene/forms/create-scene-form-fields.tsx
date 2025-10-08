// src/components/aspire/scene/forms/create-scene-form-fields.tsx
"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SceneFormData } from "@/lib/schemas/scene-schema";

interface CreateSceneFormFieldsProps {
  form: UseFormReturn<SceneFormData>;
  isSubmitting: boolean;
}

export function CreateSceneFormFields({
  form,
  isSubmitting,
}: CreateSceneFormFieldsProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre de la escena</FormLabel>
          <FormControl>
            <Input
              placeholder="ej. Configuración actual, Con paneles acústicos, etc."
              {...field}
              disabled={isSubmitting}
            />
          </FormControl>
          <FormDescription>
            Un nombre descriptivo para identificar esta configuración
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
