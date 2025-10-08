// src/components/aspire/scene/forms/create-scene-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateSceneFormFields } from "@/components/aspire/scene/forms/create-scene-form-fields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createScene } from "@/lib/actions/scene-actions";
import type { SceneFormData } from "@/lib/schemas/scene-schema";
import { sceneSchema } from "@/lib/schemas/scene-schema";
import type { SceneWithSimulations } from "@/lib/types/scene";

interface CreateSceneFormProps {
  projectId: string;
  userId: string;
  onSuccess: (scene: SceneWithSimulations) => void;
  onCancel: () => void;
}

export function CreateSceneForm({
  projectId,
  userId,
  onSuccess,
  onCancel,
}: CreateSceneFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SceneFormData>({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: SceneFormData) => {
    setIsSubmitting(true);

    const result = await createScene(data, projectId, userId);

    if (result.success && result.data) {
      toast.success("Escena creada exitosamente");
      form.reset();
      onSuccess(result.data as SceneWithSimulations);
    } else {
      toast.error(result.error || "Error al crear la escena");
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CreateSceneFormFields form={form} isSubmitting={isSubmitting} />

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
            {isSubmitting ? "Creando..." : "Crear escena"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
