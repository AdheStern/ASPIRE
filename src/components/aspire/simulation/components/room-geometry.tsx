// src/components/aspire/simulation/components/room-geometry.tsx

"use client";

/**
 * Componente de geometría de la habitación para React Three Fiber
 * Renderiza un cubo con caras clicables para asignar materiales
 * La cara FRONTAL (Z-) está marcada como ESCENARIO
 */

import { Edges, Text } from "@react-three/drei";
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
  const handleFaceClick = (event: any) => {
    if (!canSelectFaces) return;

    event.stopPropagation();

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
      return "#0088ff";
    }

    // Si tiene material asignado (no default)
    const material = materials?.[faceType];
    if (material && material.materialId !== "default") {
      return "#00ff88"; // Verde para caras con material
    }

    // Sin material (default)
    return "#333333"; // Gris oscuro
  };

  return (
    <group>
      {/* Cubo principal de la habitación */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={handleFaceClick}
        onPointerOver={(e) => {
          if (!canSelectFaces) return;
          e.stopPropagation();
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
        {[
          materials?.right || {
            materialId: "default",
            absorptionCoefficient: 0.1,
          },
          materials?.left || {
            materialId: "default",
            absorptionCoefficient: 0.1,
          },
          materials?.ceiling || {
            materialId: "default",
            absorptionCoefficient: 0.1,
          },
          materials?.floor || {
            materialId: "default",
            absorptionCoefficient: 0.1,
          },
          materials?.front || {
            materialId: "default",
            absorptionCoefficient: 0.1,
          },
          materials?.back || {
            materialId: "default",
            absorptionCoefficient: 0.1,
          },
        ].map((mat, index) => {
          const faceType = FACE_INDEX_MAP[index];
          const color = getFaceColor(faceType);
          const isHovered = hoveredFace === index;

          return (
            <meshStandardMaterial
              key={index}
              attach={`material-${index}`}
              color={isHovered ? "#555555" : color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          );
        })}

        {/* Wireframe (borde verde) */}
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
          color={EDITOR_COLORS.roomFrontFace}
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
