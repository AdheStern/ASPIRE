// src/components/aspire/project/forms/create-project-form-fields.tsx
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
import { Textarea } from "@/components/ui/textarea";
import type { ProjectFormData } from "@/lib/schemas/project-schema";

interface CreateProjectFormFieldsProps {
  form: UseFormReturn<ProjectFormData>;
  isSubmitting: boolean;
}

export function CreateProjectFormFields({
  form,
  isSubmitting,
}: CreateProjectFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del proyecto</FormLabel>
            <FormControl>
              <Input
                placeholder="ej. Templo Central"
                {...field}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormDescription>
              Un nombre descriptivo para identificar tu proyecto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Descripción
              <span className="text-muted-foreground ml-1">(opcional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="ej. Análisis acústico del templo principal ubicado en la Av. Principal #123"
                className="resize-none"
                rows={3}
                {...field}
                value={field.value || ""}
                disabled={isSubmitting}
              />
            </FormControl>
            <FormDescription>
              Información adicional sobre el proyecto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
