// src/components/aspire/simulation/room-editor/room-editor-layout.tsx

"use client";

/**
 * Layout principal del editor de habitaciones 3D
 * CRITICAL: Debe ser 100% responsivo y NUNCA romper el viewport
 * Compatible con sidebar colapsable de shadcn
 */

import { useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/lib/three/hooks/use-keyboard-shortcuts";
import { useEditorStore } from "@/lib/three/store/editor-store";
import type { SpeakerFromDB } from "@/lib/three/types/editor.types";
import { DockToolbar } from "../panels/dock-toolbar";
import { HeaderBar } from "../panels/header-bar";
import { LeftPanel } from "../panels/left-panel";
import { RightPanel } from "../panels/right-panel";
import { StatusBar } from "../panels/status-bar";
import type { SceneData } from "../types";
import { RoomEditorCanvas } from "./room-editor-canvas";

// Interfaz que coincide EXACTAMENTE con la estructura de la BD
interface AcousticMaterialFromDB {
  id: string;
  name: string;
  description?: string | null;
  absorptionCoefficients: Record<string, number>; // JSON field
}

interface RoomEditorLayoutProps {
  scene: SceneData;
  projectId: string;
  userId: string;
  materials?: AcousticMaterialFromDB[];
}

export function RoomEditorLayout({
  scene,
  materials = [],
}: RoomEditorLayoutProps) {
  // Activar atajos de teclado
  useKeyboardShortcuts();

  // Estado para forzar re-render cuando el viewport cambia
  const [viewportKey, setViewportKey] = useState(0);

  // Escuchar cambios de tamaño del viewport
  useEffect(() => {
    const handleResize = () => {
      setViewportKey((prev) => prev + 1);
    };

    // Observar cambios en el tamaño del contenedor
    const resizeObserver = new ResizeObserver(handleResize);
    const container = document.querySelector("[data-editor-container]");

    if (container) {
      resizeObserver.observe(container);
    }

    // También escuchar resize del window por si acaso
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Estado del store
  const viewMode = useEditorStore((state) => state.viewMode);
  const showGrid = useEditorStore((state) => state.showGrid);
  const selectedTool = useEditorStore((state) => state.tool);
  const editorMode = useEditorStore((state) => state.mode);
  const dimensions = useEditorStore((state) => state.dimensions);
  const selectedSpeaker = useEditorStore((state) => state.selectedSpeaker);
  const speakers = useEditorStore((state) => state.speakers);
  const faceMaterials = useEditorStore((state) => state.faceMaterials);
  const selectedFace = useEditorStore((state) => state.selectedFace);

  // Acciones del store
  const setViewMode = useEditorStore((state) => state.setViewMode);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);
  const setTool = useEditorStore((state) => state.setTool);
  const setMode = useEditorStore((state) => state.setMode);
  const updateDimension = useEditorStore((state) => state.updateDimension);
  const updateFaceMaterial = useEditorStore(
    (state) => state.updateFaceMaterial
  );
  const setSpeakers = useEditorStore((state) => state.setSpeakers);
  const setDimensions = useEditorStore((state) => state.setDimensions);

  // Inicializar el editor con datos de la escena
  useEffect(() => {
    // Cargar dimensiones
    if (scene.geometryData?.dimensions) {
      setDimensions(scene.geometryData.dimensions);
    }

    // Cargar speakers con nombre corregido
    if (scene.soundSourceData?.speakers) {
      const speakersData = scene.soundSourceData.speakers.map(
        (s: SpeakerFromDB) => {
          // ✅ CORRECCIÓN: Construir nombre correcto desde speakerId
          let speakerName = s.name || "";

          // Si el name es genérico (empieza con "speaker-3d-"), usar speakerId
          if (!speakerName || speakerName.startsWith("speaker-3d-")) {
            // speakerId debería ser algo como "jbl-prx908"
            const id = s.speakerId ?? s.id;

            if (id?.includes("-")) {
              const parts = id.split("-");

              // Evitar parsear IDs de nodo internos ("speaker-3d-node_10")
              if (parts[0] !== "speaker" && parts[1] !== "3d") {
                const brand = parts[0].toUpperCase(); // jbl -> JBL
                const model = parts.slice(1).join(" ").toUpperCase(); // prx908 -> PRX908
                speakerName = `${brand} ${model}`;
              } else {
                // Si es ID interno, intentar usar speakerId
                speakerName = s.speakerId ?? id;
              }
            } else {
              speakerName = id;
            }
          }

          return {
            id: s.id,
            name: speakerName, // ✅ Nombre corregido
            position: [s.position.x, s.position.y, s.position.z] as [
              number,
              number,
              number
            ],
            rotation: [s.rotation.x, s.rotation.y, s.rotation.z] as [
              number,
              number,
              number
            ],
            scale: [1, 1, 1] as [number, number, number],
            speakerId: s.speakerId ?? s.id,
            specifications: s.specifications,
          };
        }
      );

      console.log("🔊 Speakers loaded:", speakersData.length);
      if (speakersData.length > 0) {
        console.log("🔊 First speaker:", {
          id: speakersData[0].id,
          name: speakersData[0].name,
          speakerId: speakersData[0].speakerId,
        });
      }

      setSpeakers(speakersData);
    }
  }, [scene, setDimensions, setSpeakers]);

  // Helper para obtener el material de una cara
  const getFaceMaterial = (face: string) => {
    return faceMaterials[face as keyof typeof faceMaterials];
  };

  // Speaker seleccionado
  const selectedSpeakerData = selectedSpeaker
    ? speakers.find((s) => s.id === selectedSpeaker) || null
    : null;

  // Log para debugging
  useEffect(() => {
    if (materials.length > 0) {
      console.log("🎨 Materials in RoomEditorLayout:", materials.length);
      console.log("🎨 First material:", materials[0]);
      console.log(
        "🎨 First material coefficients:",
        materials[0]?.absorptionCoefficients
      );
    }
  }, [materials]);

  return (
    <div
      className="flex flex-col w-full h-full overflow-hidden"
      data-editor-container
      key={viewportKey}
    >
      {/* Header Bar - altura fija */}
      <div className="shrink-0">
        <HeaderBar
          sceneName={scene.name}
          projectName={scene.project.name}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showGrid={showGrid}
          onToggleGrid={toggleGrid}
        />
      </div>

      {/* Main Content - flex-1 con overflow hidden */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        {/* Left Panel - con su propio scroll */}
        <div className="shrink-0 h-full overflow-hidden">
          <LeftPanel
            dimensions={dimensions}
            onDimensionChange={updateDimension}
            selectedTool={selectedTool}
            onToolChange={setTool}
          />
        </div>

        {/* Canvas 3D (React Three Fiber) - flex-1 */}
        <div className="flex-1 relative bg-zinc-900 min-w-0 h-full overflow-hidden">
          <RoomEditorCanvas />
        </div>

        {/* Right Panel - con su propio scroll */}
        <div className="shrink-0 h-full overflow-hidden">
          <RightPanel
            selectedSpeaker={selectedSpeakerData}
            faceMaterials={faceMaterials}
            onUpdateFaceMaterial={updateFaceMaterial}
            getFaceMaterial={getFaceMaterial}
            selectedFace={selectedFace}
            materials={materials}
          />
        </div>
      </div>

      {/* Dock Toolbar (flotante en el centro inferior) */}
      <DockToolbar
        selectedTool={selectedTool}
        onToolChange={setTool}
        editorMode={editorMode}
        onModeChange={setMode}
      />

      {/* Status Bar - altura fija */}
      <div className="shrink-0">
        <StatusBar selectedTool={selectedTool} showGrid={showGrid} />
      </div>
    </div>
  );
}
