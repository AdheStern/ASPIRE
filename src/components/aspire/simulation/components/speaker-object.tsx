// src/components/aspire/simulation/components/speaker-object.tsx

"use client";

/**
 * Componente de Speaker para React Three Fiber
 * Renderiza un parlante con TransformControls para mover/rotar
 * NOTA: Scale bloqueado - las dimensiones vienen de especificaciones
 */

import { Edges, TransformControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";
import {
  EDITOR_COLORS,
  SPEAKER_CONFIG,
} from "@/lib/three/constants/editor.constants";
import type { SpeakerObjectProps } from "@/lib/three/types/editor.types";
import { getSpeakerDimensions } from "@/lib/three/utils/speaker-helpers";
import { SpeakerDirectivityCone } from "./speaker-directivity-cone";

export function SpeakerObject({
  speaker,
  isSelected,
  selectedTool,
  onSelect,
  onUpdate,
}: SpeakerObjectProps) {
  const meshRef = useRef<Mesh>(null);

  const dimensions = getSpeakerDimensions(speaker);
  const color = isSelected
    ? SPEAKER_CONFIG.selectedColor
    : SPEAKER_CONFIG.defaultColor;

  // Determinar el modo de TransformControls - SIN SCALE
  const transformMode =
    selectedTool === "move"
      ? "translate"
      : selectedTool === "rotate"
      ? "rotate"
      : undefined;

  return (
    <group>
      {/* TransformControls solo si está seleccionado y herramienta != select */}
      {isSelected && transformMode && (
        <TransformControls
          object={meshRef}
          mode={transformMode}
          onObjectChange={() => {
            if (!meshRef.current) return;

            // Actualizar posición/rotación cuando cambia
            const pos = meshRef.current.position;
            const rot = meshRef.current.rotation;

            onUpdate({
              position: [pos.x, pos.y, pos.z],
              rotation: [rot.x, rot.y, rot.z],
            });
          }}
        />
      )}

      {/* Mesh del Speaker */}
      <mesh
        ref={meshRef}
        position={speaker.position}
        rotation={speaker.rotation}
        scale={speaker.scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[dimensions.width, dimensions.height, dimensions.depth]}
        />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={SPEAKER_CONFIG.opacity}
        />

        {/* Wireframe del speaker con color suave */}
        <Edges
          threshold={15}
          color={isSelected ? "#ffffff" : EDITOR_COLORS.speakerWireframe}
          linewidth={isSelected ? 2 : 1}
        />
      </mesh>

      {/* Cono de directividad */}
      {isSelected && (
        <SpeakerDirectivityCone
          position={speaker.position}
          rotation={speaker.rotation}
          dispersion={speaker.specifications.dispersion}
          speakerDepth={dimensions.depth}
        />
      )}
    </group>
  );
}
