// src/components/aspire/simulation/components/room-geometry.tsx

"use client";

/**
 * Componente de geometría de la habitación para React Three Fiber
 * Renderiza un cubo con caras clicables para asignar materiales
 * La cara FRONTAL (Z-) está marcada como ESCENARIO
 */

import { Edges, Text } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import { EDITOR_COLORS } from "@/lib/three/constants/editor.constants";
import { useEditorStore } from "@/lib/three/store/editor-store";
import type {
  FaceType,
  RoomGeometryProps,
} from "@/lib/three/types/editor.types";

// Mapeo de índice de cara a FaceType
const FACE_INDEX_MAP: Record<number, FaceType> = {
  0: "right", // +X
  1: "left", // -X
  2: "ceiling", // +Y
  3: "floor", // -Y
  4: "front", // +Z (ESCENARIO)
  5: "back", // -Z
};

export function RoomGeometry({ dimensions, materials }: RoomGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);

  const { width, height, depth } = dimensions;

  // Estado del store
  const selectedFace = useEditorStore((state) => state.selectedFace);
  const editorMode = useEditorStore((state) => state.mode);
  const selectFace = useEditorStore((state) => state.selectFace);

  // Solo permitir selección en modo geometry
  const canSelectFaces = editorMode === "geometry";

  // Manejar click en cara
  // biome-ignore lint/a11y/noStaticElementInteractions: Necesario para interactividad 3D
  const handleFaceClick = (event: ThreeEvent<MouseEvent>) => {
    if (!canSelectFaces) return;

    event.stopPropagation();

    // ✅ CORRECCIÓN: Verificar que faceIndex existe
    if (event.faceIndex === undefined || event.faceIndex === null) return;

    // Obtener el índice de la cara clickeada
    const faceIndex = Math.floor(event.faceIndex / 2); // Cada cara tiene 2 triángulos
    const faceType = FACE_INDEX_MAP[faceIndex];

    if (faceType) {
      selectFace(faceType);
      console.log("✅ Cara seleccionada:", faceType);
    }
  };

  // Determinar color de cada cara
  const getFaceColor = (faceType: FaceType) => {
    // Si está seleccionada
    if (selectedFace === faceType) {
      return EDITOR_COLORS.roomSelected;
    }

    // Si tiene material asignado (no default)
    const material = materials?.[faceType];
    if (material && material.materialId !== "default") {
      return "#00ff88"; // Verde para caras con material
    }

    // Sin material (default)
    return EDITOR_COLORS.roomDefault;
  };

  return (
    <group>
      {/* Cubo principal de la habitación */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: false positive */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={handleFaceClick}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (!canSelectFaces) return;
          e.stopPropagation();

          // ✅ CORRECCIÓN: Verificar que faceIndex existe
          if (e.faceIndex === undefined || e.faceIndex === null) return;

          const faceIndex = Math.floor(e.faceIndex / 2);
          setHoveredFace(faceIndex);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHoveredFace(null);
          document.body.style.cursor = "auto";
        }}
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />

        {/* Materiales individuales por cara */}
        {/* ✅ CORRECCIÓN: Usar string como key en vez de index */}
        {[
          { face: "right", material: materials?.right },
          { face: "left", material: materials?.left },
          { face: "ceiling", material: materials?.ceiling },
          { face: "floor", material: materials?.floor },
          { face: "front", material: materials?.front },
          { face: "back", material: materials?.back },
        ].map(({ face, material: mat }, index) => {
          const faceType = FACE_INDEX_MAP[index];
          const color = getFaceColor(faceType);
          const isHovered = hoveredFace === index;

          return (
            <meshStandardMaterial
              key={`material-${face}`}
              attach={`material-${index}`}
              color={isHovered ? EDITOR_COLORS.roomHovered : color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          );
        })}

        {/* Wireframe (borde) */}
        <Edges
          threshold={15}
          color={EDITOR_COLORS.roomWireframe}
          linewidth={1}
        />
      </mesh>

      {/* MARCA DE LA CARA FRONTAL (Escenario) */}
      {/* Plano rojo semi-transparente en la cara Z+ (frente) */}
      <mesh position={[0, height / 2, depth / 2 + 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
        <meshBasicMaterial
          color="#ff4444"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Texto "ESCENARIO" en la cara frontal */}
      <Text
        position={[0, height * 0.75, depth / 2 + 0.02]}
        rotation={[0, 0, 0]}
        fontSize={0.5}
        color="#ff4444"
        anchorX="center"
        anchorY="middle"
      >
        ESCENARIO
      </Text>

      {/* Ejes de referencia en el centro de la habitación */}
      <axesHelper args={[Math.max(width, height, depth) * 0.3]} />
    </group>
  );
}
