// src/lib/three/hooks/use-keyboard-shortcuts.ts

/**
 * Hook para manejar atajos de teclado del editor
 * Q = Select, W = Move, E = Rotate (SIN R/Scale)
 */

import { useEffect } from "react";
import { useEditorStore } from "../store/editor-store";

export function useKeyboardShortcuts() {
  const setTool = useEditorStore((state) => state.setTool);
  const selectedSpeaker = useEditorStore((state) => state.selectedSpeaker);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar si está escribiendo en un input
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      // Atajos de teclado (SIN R/Scale)
      switch (event.key.toLowerCase()) {
        case "q":
          setTool("select");
          break;
        case "w":
          if (selectedSpeaker) setTool("move");
          break;
        case "e":
          if (selectedSpeaker) setTool("rotate");
          break;
        case "escape":
          setTool("select");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setTool, selectedSpeaker]);
}
