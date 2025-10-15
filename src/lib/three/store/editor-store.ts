// src/lib/three/store/editor-store.ts

/**
 * Store global del editor 3D usando Zustand
 * Inspirado en el sistema de Editor.js del Three.js Editor oficial
 *
 * Este store centraliza todo el estado del editor y proporciona
 * acciones para modificarlo de forma controlada.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { DEFAULT_ROOM_DIMENSIONS } from "../constants/editor.constants";
import type {
  EditorMode,
  EditorState,
  FaceMaterial,
  FaceType,
  RoomDimensions,
  Speaker3DData,
  Tool,
  ViewMode,
} from "../types/editor.types";

// ============================================================================
// ACCIONES DEL STORE
// ============================================================================

interface EditorActions {
  // Modo y herramientas
  setMode: (mode: EditorMode) => void;
  setTool: (tool: Tool) => void;
  setViewMode: (viewMode: ViewMode) => void;

  // Selección
  selectSpeaker: (id: string | null) => void;
  hoverSpeaker: (id: string | null) => void;
  selectFace: (face: FaceType | null) => void;

  // Speakers
  addSpeaker: (speaker: Speaker3DData) => void;
  updateSpeaker: (id: string, data: Partial<Speaker3DData>) => void;
  removeSpeaker: (id: string) => void;
  setSpeakers: (speakers: Speaker3DData[]) => void;

  // Dimensiones
  setDimensions: (dimensions: RoomDimensions) => void;
  updateDimension: (key: keyof RoomDimensions, value: number) => void;

  // Materiales
  updateFaceMaterial: (face: FaceType, material: FaceMaterial) => void;

  // UI
  toggleGrid: () => void;
  toggleWireframe: () => void;
  toggleAxes: () => void;

  // Reset
  reset: () => void;
}

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialState: EditorState = {
  mode: "speakers",
  tool: "select",
  viewMode: "perspective",

  selectedSpeaker: null,
  hoveredSpeaker: null,
  selectedFace: null,

  dimensions: DEFAULT_ROOM_DIMENSIONS,

  speakers: [],

  faceMaterials: {
    floor: { materialId: "default", absorptionCoefficient: 0.1 },
    ceiling: { materialId: "default", absorptionCoefficient: 0.1 },
    front: { materialId: "default", absorptionCoefficient: 0.1 },
    back: { materialId: "default", absorptionCoefficient: 0.1 },
    left: { materialId: "default", absorptionCoefficient: 0.1 },
    right: { materialId: "default", absorptionCoefficient: 0.1 },
  },

  showGrid: true,
  showWireframe: false,
  showAxes: true,
};

// ============================================================================
// STORE
// ============================================================================

export const useEditorStore = create<EditorState & EditorActions>()(
  devtools(
    (set) => ({
      ...initialState,

      // Modo y herramientas
      setMode: (mode) => set({ mode }, false, "setMode"),

      setTool: (tool) => set({ tool }, false, "setTool"),

      setViewMode: (viewMode) => set({ viewMode }, false, "setViewMode"),

      // Selección
      selectSpeaker: (id) =>
        set({ selectedSpeaker: id }, false, "selectSpeaker"),

      hoverSpeaker: (id) => set({ hoveredSpeaker: id }, false, "hoverSpeaker"),

      selectFace: (face) => set({ selectedFace: face }, false, "selectFace"),

      // Speakers
      addSpeaker: (speaker) =>
        set(
          (state) => ({
            speakers: [...state.speakers, speaker],
          }),
          false,
          "addSpeaker"
        ),

      updateSpeaker: (id, data) =>
        set(
          (state) => ({
            speakers: state.speakers.map((s) =>
              s.id === id ? { ...s, ...data } : s
            ),
          }),
          false,
          "updateSpeaker"
        ),

      removeSpeaker: (id) =>
        set(
          (state) => ({
            speakers: state.speakers.filter((s) => s.id !== id),
            selectedSpeaker:
              state.selectedSpeaker === id ? null : state.selectedSpeaker,
          }),
          false,
          "removeSpeaker"
        ),

      setSpeakers: (speakers) => set({ speakers }, false, "setSpeakers"),

      // Dimensiones
      setDimensions: (dimensions) =>
        set({ dimensions }, false, "setDimensions"),

      updateDimension: (key, value) =>
        set(
          (state) => ({
            dimensions: {
              ...state.dimensions,
              [key]: value,
            },
          }),
          false,
          "updateDimension"
        ),

      // Materiales
      updateFaceMaterial: (face, material) =>
        set(
          (state) => ({
            faceMaterials: {
              ...state.faceMaterials,
              [face]: material,
            },
          }),
          false,
          "updateFaceMaterial"
        ),

      // UI
      toggleGrid: () =>
        set((state) => ({ showGrid: !state.showGrid }), false, "toggleGrid"),

      toggleWireframe: () =>
        set(
          (state) => ({ showWireframe: !state.showWireframe }),
          false,
          "toggleWireframe"
        ),

      toggleAxes: () =>
        set((state) => ({ showAxes: !state.showAxes }), false, "toggleAxes"),

      // Reset
      reset: () => set(initialState, false, "reset"),
    }),
    { name: "RoomEditor3D" }
  )
);

// ============================================================================
// SELECTORES ÚTILES
// ============================================================================

/**
 * Hook para obtener el speaker seleccionado
 */
export const useSelectedSpeaker = () =>
  useEditorStore((state) => {
    if (!state.selectedSpeaker) return null;
    return state.speakers.find((s) => s.id === state.selectedSpeaker) || null;
  });

/**
 * Hook para verificar si OrbitControls debe estar activo
 */
export const useShouldOrbitControlsBeEnabled = () =>
  useEditorStore((state) => {
    // OrbitControls se desactiva cuando hay un speaker seleccionado
    // y la herramienta no es "select"
    if (state.selectedSpeaker && state.tool !== "select") {
      return false;
    }
    return true;
  });
