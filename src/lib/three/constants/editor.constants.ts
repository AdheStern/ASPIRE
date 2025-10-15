// src/lib/three/constants/editor.constants.ts

/**
 * Constantes del editor 3D
 * Paleta de colores suaves inspirada en Blender/Maya
 */

import type { FaceType } from "../types/editor.types";

// ============================================================================
// COLORES DEL EDITOR - Inspirado en Blender
// ============================================================================

export const EDITOR_COLORS = {
  // Background - casi negro pero no del todo
  background: "#1a1a1a",

  // Room/Geometry - color más llamativo
  roomDefault: "#a3a3a3", // Gris
  roomSelected: "#8b5cf6", // Violeta claro al seleccionar
  roomHovered: "#8b7de8", // Violeta medio-claro al hover
  roomWireframe: "#d4d4d4", // Violeta oscurecido para wireframes
  roomFrontFace: "#ff4444", // ✅ AGREGADO: Color para cara frontal (escenario)

  // Speakers - naranja y celeste
  speakerDefault: "#ff8c42", // Naranja vibrante
  speakerSelected: "#4fc3f7", // Celeste vibrante
  speakerHovered: "#ffa766", // Naranja más claro
  speakerWireframe: "#d67233", // Naranja oscurecido

  // Directivity cone - verde vibrante tipo green-300/400
  directivityCone: "#4ade80", // Verde brillante pero no radioactivo (green-400)
  directivityOmni: "#a78bfa", // Violeta vibrante

  // Grid - verde visible
  gridPrimary: "#fafafa", // Verde visible
  gridSecondary: "#1a2f0d", // Verde más oscuro

  // Ejes - colores originales RGB
  axisX: "#ff0000", // Rojo puro
  axisY: "#00ff00", // Verde puro
  axisZ: "#0000ff", // Azul puro

  // UI overlays
  overlayBg: "rgba(20, 20, 20, 0.9)",
  overlayText: "#e8e8e8",

  // Estados
  warning: "#f59e0b", // Ámbar
  error: "#ef4444", // Rojo
  success: "#10b981", // Verde esmeralda
} as const;

// ============================================================================
// CONFIGURACIÓN DE CÁMARA
// ============================================================================

export const CAMERA_CONFIG = {
  fov: 50,
  near: 0.1,
  far: 1000,
  initialPosition: { x: 15, y: 10, z: 15 },
  initialTarget: { x: 0, y: 2, z: 0 },
} as const;

// ============================================================================
// CONFIGURACIÓN DE ILUMINACIÓN
// ============================================================================

export const LIGHTING_CONFIG = {
  ambient: {
    color: 0xffffff,
    intensity: 0.5,
  },
  directional: {
    color: 0xffffff,
    intensity: 0.8,
    position: { x: 10, y: 10, z: 5 },
  },
  secondary: {
    color: 0xffffff,
    intensity: 0.3,
    position: { x: -10, y: 10, z: -5 },
  },
} as const;

// ============================================================================
// CONFIGURACIÓN DE GRID
// ============================================================================

export const GRID_CONFIG = {
  size: 20,
  divisions: 20,
  cellSize: 1,
  cellThickness: 0.5,
  cellColor: EDITOR_COLORS.gridPrimary,
  sectionSize: 5,
  sectionThickness: 1,
  sectionColor: EDITOR_COLORS.gridSecondary,
} as const;

// ============================================================================
// CONFIGURACIÓN DE CONTROLES
// ============================================================================

export const CONTROLS_CONFIG = {
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 2,
  maxDistance: 50,
  minPolarAngle: 0, // ✅ Permite rotar completamente hacia arriba
  maxPolarAngle: Math.PI, // ✅ Permite rotar completamente hacia abajo (180°)
  screenSpacePanning: true,
} as const;

// ============================================================================
// CONFIGURACIÓN DE SPEAKERS
// ============================================================================

export const SPEAKER_CONFIG = {
  defaultColor: EDITOR_COLORS.speakerDefault,
  selectedColor: EDITOR_COLORS.speakerSelected,
  hoveredColor: EDITOR_COLORS.speakerHovered,
  opacity: 0.85,
  wireframeColor: EDITOR_COLORS.speakerWireframe,

  directivity: {
    coneColor: EDITOR_COLORS.directivityCone,
    omniColor: EDITOR_COLORS.directivityOmni,
    coneOpacity: 0.15,
    wireframeOpacity: 0.3,
    segments: 16,
    sphereSegments: 16,
    omniRadius: 2,
  },
} as const;

// ============================================================================
// CONFIGURACIÓN DE ROOM
// ============================================================================

export const ROOM_CONFIG = {
  defaultColor: EDITOR_COLORS.roomDefault,
  selectedColor: EDITOR_COLORS.roomSelected,
  hoveredColor: EDITOR_COLORS.roomHovered,
  opacity: 0.3,
  wireframeColor: EDITOR_COLORS.roomWireframe,
} as const;

// ============================================================================
// CONFIGURACIÓN DE EJES
// ============================================================================

export const AXIS_CONFIG = {
  length: 2,
  colors: {
    x: EDITOR_COLORS.axisX,
    y: EDITOR_COLORS.axisY,
    z: EDITOR_COLORS.axisZ,
  },
} as const;

// ============================================================================
// NOMBRES DE CARAS
// ============================================================================

export const FACE_NAMES: Record<FaceType, string> = {
  floor: "Piso",
  ceiling: "Techo",
  front: "Pared Frontal",
  back: "Pared Trasera",
  left: "Pared Izquierda",
  right: "Pared Derecha",
} as const;

// ============================================================================
// CONVERSIONES
// ============================================================================

export const MM_TO_METERS = 0.001;
export const METERS_TO_MM = 1000;

// ============================================================================
// VALORES POR DEFECTO
// ============================================================================

export const DEFAULT_ROOM_DIMENSIONS = {
  width: 10,
  height: 4,
  depth: 8,
} as const;

export const DEFAULT_SPEAKER_SCALE: [number, number, number] = [1, 1, 1];

export const DEFAULT_DISPERSION = {
  horizontal: 90,
  vertical: 60,
} as const;
