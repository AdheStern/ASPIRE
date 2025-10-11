// src/components/aspire/simulation/components/speaker-directivity-cone.tsx

"use client";

/**
 * Componente del cono de directividad del speaker
 * Visualiza el patrón de dispersión del sonido
 * Soporta tanto conos direccionales como patrones omnidireccionales
 */

import { Edges } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { SPEAKER_CONFIG } from "@/lib/three/constants/editor.constants";
import {
  degToRad,
  getValidDispersion,
  isOmnidirectional,
} from "@/lib/three/utils/speaker-helpers";

interface SpeakerDirectivityConeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  dispersion: { horizontal: number | string; vertical: number | string };
  speakerDepth: number;
}

export function SpeakerDirectivityCone({
  position,
  rotation,
  dispersion,
  speakerDepth,
}: SpeakerDirectivityConeProps) {
  // IMPORTANTE: Todos los hooks deben estar al inicio, sin condiciones

  // Verificar si es omnidireccional
  const isOmni = useMemo(() => isOmnidirectional(dispersion), [dispersion]);

  // Validar y obtener dispersión (siempre calcular, aunque no se use en modo omni)
  const validDispersion = useMemo(
    () => getValidDispersion(dispersion),
    [dispersion]
  );

  // Calcular dimensiones del cono (siempre calcular)
  const coneData = useMemo(() => {
    if (isOmni) {
      // Para omni, retornar datos vacíos
      return null;
    }

    const horizontalRad = degToRad(validDispersion.horizontal);
    const verticalRad = degToRad(validDispersion.vertical);

    // Distancia del cono (longitud visual)
    const distance = speakerDepth * 5;

    // Radios del cono basados en los ángulos de dispersión
    const radiusH = distance * Math.tan(horizontalRad / 2);
    const radiusV = distance * Math.tan(verticalRad / 2);

    // Radio promedio para crear la geometría base
    const avgRadius = (radiusH + radiusV) / 2;

    const geometry = new THREE.ConeGeometry(
      avgRadius,
      distance,
      SPEAKER_CONFIG.directivity.segments,
      1,
      true
    );

    // Rotar para que apunte hacia adelante (eje Z positivo)
    geometry.rotateX(-Math.PI / 2);

    // Factores de escala para hacer el cono elíptico
    const scaleX = radiusH / avgRadius;
    const scaleY = radiusV / avgRadius;

    return {
      geometry,
      distance,
      scaleX,
      scaleY,
    };
  }, [isOmni, validDispersion, speakerDepth]);

  // Renderizado condicional DESPUÉS de todos los hooks
  if (isOmni) {
    return (
      <group position={position}>
        <mesh>
          <sphereGeometry
            args={[
              SPEAKER_CONFIG.directivity.omniRadius,
              SPEAKER_CONFIG.directivity.sphereSegments,
              SPEAKER_CONFIG.directivity.sphereSegments,
            ]}
          />
          <meshBasicMaterial
            color={SPEAKER_CONFIG.directivity.omniColor}
            transparent
            opacity={SPEAKER_CONFIG.directivity.coneOpacity}
            side={THREE.DoubleSide}
          />
          <Edges
            threshold={15}
            color={SPEAKER_CONFIG.directivity.omniColor}
            linewidth={1}
          />
        </mesh>
      </group>
    );
  }

  // Renderizado de cono direccional
  if (!coneData) return null;

  return (
    <group position={position} rotation={rotation}>
      <mesh
        position={[0, 0, speakerDepth / 2 + coneData.distance / 2]}
        scale={[coneData.scaleX, coneData.scaleY, 1]}
      >
        <primitive object={coneData.geometry} />
        <meshBasicMaterial
          color={SPEAKER_CONFIG.directivity.coneColor}
          transparent
          opacity={SPEAKER_CONFIG.directivity.coneOpacity}
          side={THREE.DoubleSide}
        />
        <Edges
          threshold={15}
          color={SPEAKER_CONFIG.directivity.coneColor}
          linewidth={1}
        />
      </mesh>
    </group>
  );
}
