// src/lib/three/hooks/use-room-editor.ts

/**
 * Hook principal para inicializar y gestionar el editor 3D
 * Simplifica la lógica y centraliza la inicialización
 */

import { useEffect } from "react";
import type { SceneData } from "@/components/aspire/simulation/types";
import { useEditorStore } from "../store/editor-store";

interface UseRoomEditorOptions {
  scene: SceneData;
  projectId: string;
  userId: string;
}

export function useRoomEditor({
  scene,
  projectId,
  userId,
}: UseRoomEditorOptions) {
  const setSpeakers = useEditorStore((state) => state.setSpeakers);
  const setDimensions = useEditorStore((state) => state.setDimensions);
  const reset = useEditorStore((state) => state.reset);

  // Inicializar el editor con datos de la escena
  useEffect(() => {
    console.log("🎬 Inicializando editor 3D con escena:", scene.name);

    // Cargar dimensiones
    if (scene.geometryData?.dimensions) {
      setDimensions(scene.geometryData.dimensions);
    }

    // Cargar speakers
    if (scene.soundSourceData?.speakers) {
      const speakersData = scene.soundSourceData.speakers.map((s) => ({
        id: s.id,
        name: s.name,
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
        speakerId: s.id,
        specifications: s.specifications,
      }));
      setSpeakers(speakersData);

      console.log(`✅ ${speakersData.length} speakers cargados`);
    }

    // Cleanup: resetear el editor al desmontar
    return () => {
      console.log("🧹 Limpiando editor 3D");
      reset();
    };
  }, [scene.id, setDimensions, setSpeakers, reset]);

  return {
    projectId,
    userId,
    sceneName: scene.name,
    projectName: scene.project.name,
  };
}
