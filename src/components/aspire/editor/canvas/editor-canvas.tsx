// src/components/aspire/editor/canvas/editor-canvas.tsx
"use client";

import { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionLineType,
  Controls,
  type Edge,
  type Node as FlowNode,
  type NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import "./react-flow-overrides.css";

import {
  type BaseNodeData,
  NodeType,
  useEditorStore,
} from "@/lib/stores/editor-store";
import { InstrumentNode } from "../nodes/types/instrument-node";
import { MicrophoneNode } from "../nodes/types/microphone-node";
import { MixerNode } from "../nodes/types/mixer-node";
import { ProcessorNode } from "../nodes/types/processor-node";
import { SimulationNode } from "../nodes/types/simulation-node";
import { SpeakerNode } from "../nodes/types/speaker-node";
import { isValidConnection as validateConnection } from "./connection-validator";

// Definir tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  instrument: InstrumentNode,
  microphone: MicrophoneNode,
  mixer: MixerNode,
  processor: ProcessorNode,
  speaker: SpeakerNode,
  simulation: SimulationNode,
};

function Flow() {
  const reactFlowInstance = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    addNode,
  } = useEditorStore();

  // Validar conexiones
  const isValidConnection = useCallback(
    (connection: Connection) => {
      return validateConnection(connection, nodes, edges);
    },
    [nodes, edges]
  );

  // Manejar drag over para permitir drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Manejar drop de nuevos nodos
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const typeString = event.dataTransfer.getData("application/reactflow");
      if (!typeString) return;

      // Validar que el tipo sea válido
      const nodeType = typeString as NodeType;
      if (!Object.values(NodeType).includes(nodeType)) {
        console.warn(`Invalid node type: ${typeString}`);
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(nodeType, position);
    },
    [reactFlowInstance, addNode]
  );

  // Manejar selección de nodo
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode<BaseNodeData>) => {
      selectNode(node);
    },
    [selectNode]
  );

  // Manejar click en el canvas (deseleccionar)
  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // Manejar selección de edge
  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      console.log("Edge clicked:", edge.id);
      // Aquí podrías implementar lógica adicional para mostrar info del edge
    },
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      onPaneClick={handlePaneClick}
      isValidConnection={isValidConnection}
      onDragOver={onDragOver}
      onDrop={onDrop}
      nodeTypes={nodeTypes}
      fitView
      className="bg-background"
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.5}
      maxZoom={2}
      deleteKeyCode={["Delete", "Backspace"]} // Permitir eliminar con Delete o Backspace
      connectionLineType={ConnectionLineType.Straight} // Líneas rectas para conexiones verticales
      defaultEdgeOptions={{
        type: "straight",
        animated: false,
        style: {
          strokeWidth: 3,
          stroke: "#94a3b8",
          cursor: "pointer",
        },
        labelStyle: {
          fontSize: 12,
        },
      }}
      elementsSelectable={true} // Permitir seleccionar elementos
      nodesConnectable={true} // Permitir conectar nodos
      nodesDraggable={true} // Permitir arrastrar nodos
      zoomOnScroll={true} // Zoom con scroll
      panOnScroll={false} // No hacer pan con scroll
      panOnDrag={true} // Hacer pan arrastrando el canvas
      selectionOnDrag={false} // No seleccionar al arrastrar
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={1}
        className="bg-muted/20"
      />
      <Controls
        showZoom
        showFitView
        showInteractive={false}
        position="bottom-right"
      />
    </ReactFlow>
  );
}

export function EditorCanvas() {
  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <Flow />
      </div>
    </ReactFlowProvider>
  );
}
