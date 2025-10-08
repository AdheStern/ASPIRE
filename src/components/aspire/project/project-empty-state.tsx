import { Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectEmptyStateProps {
  hasProjects: boolean;
  onCreateProject: () => void;
}

export function ProjectEmptyState({
  hasProjects,
  onCreateProject,
}: ProjectEmptyStateProps) {
  // Si hay proyectos pero la búsqueda no encuentra nada
  if (hasProjects) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No se encontraron proyectos</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          No hay proyectos que coincidan con tu búsqueda. Intenta con otros
          términos.
        </p>
      </div>
    );
  }

  // Si no hay proyectos en absoluto
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Layers className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">Crea tu primer proyecto</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Los proyectos te permiten organizar tus simulaciones acústicas por
        templo o lugar. Comienza creando tu primer proyecto.
      </p>
      <Button onClick={onCreateProject} className="mt-4">
        Crear proyecto
      </Button>
    </div>
  );
}
