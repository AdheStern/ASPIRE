// src/components/aspire/project/forms/create-project-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateProjectFormFields } from "@/components/aspire/project/forms/create-form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createProject } from "@/lib/actions/project-actions";
import type { ProjectFormData } from "@/lib/schemas/project-schema";
import { projectSchema } from "@/lib/schemas/project-schema";
import type { ProjectWithCount } from "@/lib/types/project";

interface CreateProjectFormProps {
  userId: string;
  onSuccess: (project: ProjectWithCount) => void;
  onCancel: () => void;
}

export function CreateProjectForm({
  userId,
  onSuccess,
  onCancel,
}: CreateProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    const result = await createProject(data, userId);

    if (result.success && result.data) {
      toast.success("Proyecto creado exitosamente");
      form.reset();
      onSuccess(result.data as ProjectWithCount);
    } else {
      toast.error(result.error || "Error al crear el proyecto");
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CreateProjectFormFields form={form} isSubmitting={isSubmitting} />

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear proyecto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
