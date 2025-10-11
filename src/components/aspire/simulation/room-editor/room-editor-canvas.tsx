// src/components/aspire/simulation/room-editor/room-editor-canvas.tsx

"use client";

/**
 * Canvas principal del editor 3D usando React Three Fiber
 * Con paleta de colores suaves tipo Blender/Maya
 */

import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  CAMERA_CONFIG,
  EDITOR_COLORS,
  GRID_CONFIG,
  LIGHTING_CONFIG,
} from "@/lib/three/constants/editor.constants";
import {
  useEditorStore,
  useShouldOrbitControlsBeEnabled,
} from "@/lib/three/store/editor-store";
import { RoomGeometry } from "../components/room-geometry";
import { SpeakerObject } from "../components/speaker-object";

export function RoomEditorCanvas() {
  // Estado del store
  const dimensions = useEditorStore((state) => state.dimensions);
  const speakers = useEditorStore((state) => state.speakers);
  const selectedSpeaker = useEditorStore((state) => state.selectedSpeaker);
  const selectedTool = useEditorStore((state) => state.tool);
  const showGrid = useEditorStore((state) => state.showGrid);
  const faceMaterials = useEditorStore((state) => state.faceMaterials);

  // Acciones
  const selectSpeaker = useEditorStore((state) => state.selectSpeaker);
  const updateSpeaker = useEditorStore((state) => state.updateSpeaker);

  // Determinar si OrbitControls debe estar activo
  const orbitEnabled = useShouldOrbitControlsBeEnabled();

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{
          position: [
            CAMERA_CONFIG.initialPosition.x,
            CAMERA_CONFIG.initialPosition.y,
            CAMERA_CONFIG.initialPosition.z,
          ],
          fov: CAMERA_CONFIG.fov,
          near: CAMERA_CONFIG.near,
          far: CAMERA_CONFIG.far,
        }}
        gl={{
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
        shadows
        onPointerMissed={() => selectSpeaker(null)}
      >
        {/* Color de fondo suave tipo Blender */}
        <color attach="background" args={[EDITOR_COLORS.background]} />

        {/* Iluminación */}
        <ambientLight
          intensity={LIGHTING_CONFIG.ambient.intensity}
          color={LIGHTING_CONFIG.ambient.color}
        />

        <directionalLight
          position={[
            LIGHTING_CONFIG.directional.position.x,
            LIGHTING_CONFIG.directional.position.y,
            LIGHTING_CONFIG.directional.position.z,
          ]}
          intensity={LIGHTING_CONFIG.directional.intensity}
          color={LIGHTING_CONFIG.directional.color}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <directionalLight
          position={[
            LIGHTING_CONFIG.secondary.position.x,
            LIGHTING_CONFIG.secondary.position.y,
            LIGHTING_CONFIG.secondary.position.z,
          ]}
          intensity={LIGHTING_CONFIG.secondary.intensity}
          color={LIGHTING_CONFIG.secondary.color}
        />

        {/* Grid del suelo con colores suaves */}
        {showGrid && (
          <Grid
            args={[GRID_CONFIG.size, GRID_CONFIG.size]}
            cellSize={GRID_CONFIG.cellSize}
            cellThickness={GRID_CONFIG.cellThickness}
            cellColor={GRID_CONFIG.cellColor}
            sectionSize={GRID_CONFIG.sectionSize}
            sectionThickness={GRID_CONFIG.sectionThickness}
            sectionColor={GRID_CONFIG.sectionColor}
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />
        )}

        {/* Geometría de la habitación */}
        <RoomGeometry dimensions={dimensions} materials={faceMaterials} />

        {/* Speakers */}
        {speakers.map((speaker) => (
          <SpeakerObject
            key={speaker.id}
            speaker={speaker}
            isSelected={selectedSpeaker === speaker.id}
            selectedTool={selectedTool}
            onSelect={() => selectSpeaker(speaker.id)}
            onUpdate={(data) => updateSpeaker(speaker.id, data)}
          />
        ))}

        {/* Controles de cámara (OrbitControls) */}
        <OrbitControls
          makeDefault
          enabled={orbitEnabled}
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
          target={[
            CAMERA_CONFIG.initialTarget.x,
            CAMERA_CONFIG.initialTarget.y,
            CAMERA_CONFIG.initialTarget.z,
          ]}
        />

        {/* Gizmo de orientación con colores suaves */}
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={[
              EDITOR_COLORS.axisX,
              EDITOR_COLORS.axisY,
              EDITOR_COLORS.axisZ,
            ]}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
