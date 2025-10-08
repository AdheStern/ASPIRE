// src/components/aspire/editor/scene-editor.tsx
"use client";

import { ChevronLeft, Play, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/stores/editor-store";
import type { EditorCatalogs } from "@/lib/types/catalog";
import type { Scene } from "@/lib/types/scene";
import { EditorCanvas } from "./canvas/editor-canvas";
import { NodeLibrary } from "./sidebar/node-library";
import { NodeProperties } from "./sidebar/node-properties";

interface SceneEditorProps {
  scene: Scene;
  catalogs: EditorCatalogs;
  userId: string;
  onSave?: (data: {
    nodes: ReturnType<typeof useEditorStore.getState>["nodes"];
    edges: ReturnType<typeof useEditorStore.getState>["edges"];
  }) => Promise<void>;
}

export function SceneEditor({
  scene,
  catalogs,
  userId,
  onSave,
}: SceneEditorProps) {
  const {
    nodes,
    edges,
    selectedNode,
    hasChanges,
    initializeEditor,
    markAsSaved,
    selectNode,
  } = useEditorStore();

  const [isSaving, setIsSaving] = useState(false);
  const [sidebarView, setSidebarView] = useState<"library" | "properties">(
    "library"
  );

  // Cuando se selecciona un nodo, cambiar a vista de propiedades
  useEffect(() => {
    if (selectedNode) {
      setSidebarView("properties");
    }
  }, [selectedNode]);

  // Cuando se deselecciona un nodo, volver a la librería
  const handleBackToLibrary = useCallback(() => {
    selectNode(null);
    setSidebarView("library");
  }, [selectNode]);

  // Inicializar el editor con los datos de la escena
  useEffect(() => {
    if (scene.instrumentSetup) {
      try {
        const setupData =
          typeof scene.instrumentSetup === "string"
            ? JSON.parse(scene.instrumentSetup)
            : scene.instrumentSetup;

        if (setupData?.nodes && setupData?.edges) {
          initializeEditor(setupData.nodes, setupData.edges);
        }
      } catch (error) {
        console.error("Error loading scene data:", error);
        toast.error("Error al cargar los datos de la escena");
      }
    }
  }, [scene.instrumentSetup, initializeEditor]);

  // Guardar cambios
  const handleSave = useCallback(async () => {
    if (!onSave || !hasChanges) return;

    setIsSaving(true);
    try {
      await onSave({ nodes, edges });
      markAsSaved();
      toast.success("Escena guardada exitosamente");
    } catch {
      toast.error("Error al guardar la escena");
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, onSave, hasChanges, markAsSaved]);

  // Iniciar simulación
  const handleStartSimulation = useCallback(() => {
    toast.info("Simulación iniciada (funcionalidad en desarrollo)");
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S o Cmd+S para guardar
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // ESC para volver a la librería
      if (e.key === "Escape" && sidebarView === "properties") {
        handleBackToLibrary();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleBackToLibrary, sidebarView]);

  return (
    <div className="flex h-full w-full relative bg-background">
      {/* Canvas principal */}
      <div className="flex-1 relative">
        {/* Barra de herramientas superior */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              size="sm"
              variant={hasChanges ? "default" : "outline"}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
            <Button onClick={handleStartSimulation} size="sm" variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Iniciar Simulación
            </Button>
          </div>

          {/* Indicador de estado */}
          <div className="bg-background/80 backdrop-blur rounded-md px-3 py-1 text-xs border">
            <span className="text-muted-foreground">
              {nodes.length} nodos, {edges.length} conexiones
            </span>
            {hasChanges && (
              <span className="ml-2 text-yellow-600 dark:text-yellow-500">
                • Sin guardar
              </span>
            )}
          </div>
        </div>

        {/* Canvas del editor */}
        <div className="absolute inset-0">
          <EditorCanvas />
        </div>
      </div>

      {/* Sidebar derecha unificada */}
      <div className="relative border-l bg-sidebar w-80">
        {sidebarView === "library" ? (
          <NodeLibrary catalogs={catalogs} />
        ) : (
          <div className="h-full flex flex-col">
            {/* Header con botón de volver */}
            <div className="p-4 border-b flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBackToLibrary}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-medium">Propiedades del Nodo</h3>
            </div>
            {/* Contenido de propiedades */}
            <div className="flex-1 overflow-hidden">
              <NodeProperties
                node={selectedNode}
                catalogs={catalogs}
                userId={userId}
                onBack={handleBackToLibrary}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
