// src/components/aspire/scene/scene-empty-state.tsx

import { FlaskConical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SceneEmptyStateProps {
  hasScenes: boolean;
  onCreateScene: () => void;
}

export function SceneEmptyState({
  hasScenes,
  onCreateScene,
}: SceneEmptyStateProps) {
  if (hasScenes) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No se encontraron escenas</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          No hay escenas que coincidan con tu búsqueda. Intenta con otros
          términos.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <FlaskConical className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">Crea tu primera escena</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Las escenas te permiten configurar diferentes versiones del ambiente
        acústico para comparar resultados y encontrar la mejor configuración.
      </p>
      <Button onClick={onCreateScene} className="mt-4">
        Crear escena
      </Button>
    </div>
  );
}
