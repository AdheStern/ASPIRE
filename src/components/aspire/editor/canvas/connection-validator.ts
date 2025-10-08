// src/components/aspire/editor/canvas/connection-validator.ts
import type { Connection, Edge, Node } from "reactflow";
import { NodeType } from "@/lib/stores/editor-store";

/**
 * Reglas de conexión entre tipos de nodos
 */
const connectionRules: Record<NodeType, NodeType[]> = {
  [NodeType.INSTRUMENT]: [
    NodeType.MICROPHONE,
    NodeType.MIXER,
    NodeType.PROCESSOR,
    NodeType.SPEAKER,
  ],
  [NodeType.MICROPHONE]: [NodeType.MIXER, NodeType.PROCESSOR],
  [NodeType.MIXER]: [NodeType.PROCESSOR, NodeType.SPEAKER, NodeType.SIMULATION],
  [NodeType.PROCESSOR]: [
    NodeType.MIXER,
    NodeType.SPEAKER,
    NodeType.PROCESSOR, // Permite encadenar procesadores
    NodeType.SIMULATION,
  ],
  [NodeType.SPEAKER]: [NodeType.MICROPHONE, NodeType.SIMULATION], // Los speakers no tienen salida
  [NodeType.SIMULATION]: [], // La simulación es un endpoint final
};

/**
 * Valida si una conexión entre dos nodos es permitida
 */
export function isValidConnection(
  connection: Connection,
  nodes: Node[],
  edges: Edge[]
): boolean {
  if (!connection.source || !connection.target) return false;

  // No permitir conexiones al mismo nodo
  if (connection.source === connection.target) return false;

  // Obtener los nodos source y target
  const sourceNode = nodes.find((node) => node.id === connection.source);
  const targetNode = nodes.find((node) => node.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  // Verificar si el handle de destino ya tiene una conexión
  // (excepto para nodos de simulación que pueden recibir múltiples parlantes)
  if (targetNode.type !== "simulation") {
    const existingConnectionToTarget = edges.find(
      (edge) =>
        edge.target === connection.target &&
        edge.targetHandle === connection.targetHandle
    );

    if (existingConnectionToTarget) {
      console.warn(
        "Esta entrada ya tiene una conexión. Desconecta primero la conexión existente."
      );
      return false;
    }
  }

  // Verificar si los nodos que requieren catálogo lo tienen seleccionado
  const requiresCatalog = (nodeType: string) => {
    return nodeType === "mixer" || nodeType === "processor";
  };

  // Si el nodo target requiere catálogo y no lo tiene, no permitir conexión
  if (requiresCatalog(targetNode.type as string)) {
    const targetData = targetNode.data as { catalogId?: string };
    if (!targetData.catalogId) {
      console.warn(
        "El nodo de destino requiere un modelo seleccionado antes de conectar"
      );
      return false;
    }
  }

  // Validar tipos de conexión según las reglas de negocio
  return validateNodeConnection(
    sourceNode.type as string,
    targetNode.type as string,
    connection,
    edges
  );
}

/**
 * Reglas de validación específicas por tipo de nodo
 */
function validateNodeConnection(
  sourceType: string,
  targetType: string,
  connection: Connection,
  edges: Edge[]
): boolean {
  // Verificar si ya existe exactamente esta conexión
  const duplicateConnection = edges.find(
    (edge) =>
      edge.source === connection.source &&
      edge.target === connection.target &&
      edge.sourceHandle === connection.sourceHandle &&
      edge.targetHandle === connection.targetHandle
  );
  if (duplicateConnection) {
    console.warn("Esta conexión ya existe");
    return false;
  }

  // Verificar si la conexión está permitida según las reglas
  const allowedTargets = connectionRules[sourceType as NodeType];
  if (!allowedTargets) return false;

  return allowedTargets.includes(targetType as NodeType);
}

/**
 * Valida el número máximo de conexiones por handle
 */
export function validateHandleConnections(
  nodeId: string,
  handleId: string,
  handleType: "source" | "target",
  edges: Edge[],
  maxConnections = 1
): boolean {
  const connectionCount = edges.filter((edge) => {
    if (handleType === "source") {
      return edge.source === nodeId && edge.sourceHandle === handleId;
    } else {
      return edge.target === nodeId && edge.targetHandle === handleId;
    }
  }).length;

  return connectionCount < maxConnections;
}
