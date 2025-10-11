// src/lib/stores/editor-store.ts

import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "reactflow";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { SpeakerFromDB } from "@/lib/three/types/editor.types"; // ✅ Import correcto
import type { CatalogItem } from "@/lib/types/catalog";

// Tipos de nodos disponibles
export enum NodeType {
  INSTRUMENT = "instrument",
  MICROPHONE = "microphone",
  MIXER = "mixer",
  PROCESSOR = "processor",
  SPEAKER = "speaker",
  SIMULATION = "simulation",
}

// Datos base para cada tipo de nodo
export interface BaseNodeData {
  label: string;
  catalogId?: string; // ID del catálogo (instrument, speaker, etc.)
  catalogData?: CatalogItem; // Datos del catálogo para información dinámica
  // biome-ignore lint/suspicious/noExplicitAny: Settings puede contener cualquier configuración
  settings: Record<string, unknown>; // Permitir objetos complejos para simulación
}

// Estado del editor
interface EditorState {
  // React Flow state
  nodes: Node<BaseNodeData>[];
  edges: Edge[];

  // UI state
  selectedNode: Node<BaseNodeData> | null;
  isSaving: boolean;
  hasChanges: boolean;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<BaseNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (node: Node<BaseNodeData> | null) => void;

  // Persistence
  initializeEditor: (nodes: Node[], edges: Edge[]) => void;
  loadFlow: (nodes: Node[], edges: Edge[]) => void;
  saveFlow: () => Promise<void>;
  markAsSaved: () => void;
  setHasChanges: (hasChanges: boolean) => void;

  // Speaker-specific methods
  getSpeakerNodes: () => Node<BaseNodeData>[];
  prepareSpeakersForSimulation: () => SpeakerFromDB[]; // ✅ Tipo correcto
}

// Generador de IDs únicos
let nodeIdCounter = 1;
const getNodeId = () => `node_${nodeIdCounter++}`;

// Store
export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    // Initial state
    nodes: [],
    edges: [],
    selectedNode: null,
    isSaving: false,
    hasChanges: false,

    // React Flow handlers
    onNodesChange: (changes) => {
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes);
        state.hasChanges = true;
      });
    },

    onEdgesChange: (changes) => {
      set((state) => {
        state.edges = applyEdgeChanges(changes, state.edges);
        // Solo marcar como cambiado si realmente hubo cambios
        if (changes.length > 0) {
          state.hasChanges = true;
        }
      });
    },

    onConnect: (connection) => {
      set((state) => {
        // Validar que source y target existen
        if (!connection.source || !connection.target) {
          console.warn("Invalid connection: missing source or target");
          return;
        }

        // Generar un ID único que incluya los handles
        const edgeId = `edge_${connection.source}_${
          connection.sourceHandle || "default"
        }_to_${connection.target}_${connection.targetHandle || "default"}`;

        const newEdge: Edge = {
          id: edgeId,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
        };
        state.edges.push(newEdge);
        state.hasChanges = true;
      });
    },

    // Node management
    addNode: (type, position) => {
      const id = getNodeId();
      const newNode: Node<BaseNodeData> = {
        id,
        type,
        position,
        data: {
          label: getDefaultLabel(type),
          settings: {},
        },
      };

      set((state) => {
        state.nodes.push(newNode);
        state.hasChanges = true;
      });
    },

    updateNodeData: (nodeId, data) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id === nodeId);
        if (node) {
          node.data = { ...node.data, ...data };
          state.hasChanges = true;
        }
      });
    },

    deleteNode: (nodeId) => {
      set((state) => {
        state.nodes = state.nodes.filter((n) => n.id !== nodeId);
        state.edges = state.edges.filter(
          (e) => e.source !== nodeId && e.target !== nodeId
        );
        if (state.selectedNode?.id === nodeId) {
          state.selectedNode = null;
        }
        state.hasChanges = true;
      });
    },

    selectNode: (node) => {
      set((state) => {
        state.selectedNode = node;
      });
    },

    // Persistence - inicializar el editor con datos existentes
    initializeEditor: (nodes, edges) => {
      set((state) => {
        state.nodes = nodes;
        state.edges = edges;
        state.hasChanges = false;
        state.selectedNode = null;

        // Actualizar el contador de IDs para evitar colisiones
        const maxId = nodes.reduce((max, node) => {
          const match = node.id.match(/node_(\d+)/);
          return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
        }, 0);
        nodeIdCounter = maxId + 1;
      });
    },

    // Cargar un flujo (similar a initializeEditor pero puede usarse para otros casos)
    loadFlow: (nodes, edges) => {
      set((state) => {
        state.nodes = nodes;
        state.edges = edges;
        state.hasChanges = false;
        state.selectedNode = null;

        // Actualizar el contador de IDs
        const maxId = nodes.reduce((max, node) => {
          const match = node.id.match(/node_(\d+)/);
          return match ? Math.max(max, Number.parseInt(match[1], 10)) : max;
        }, 0);
        nodeIdCounter = maxId + 1;
      });
    },

    // Guardar el flujo actual
    saveFlow: async () => {
      set((state) => {
        state.isSaving = true;
      });

      // Aquí llamaremos a la server action
      const { nodes, edges } = get();

      try {
        // TODO: Implementar server action
        console.log("Saving flow:", { nodes, edges });

        set((state) => {
          state.hasChanges = false;
          state.isSaving = false;
        });
      } catch (error) {
        console.error("Error saving flow:", error);
        set((state) => {
          state.isSaving = false;
        });
        throw error;
      }
    },

    // Marcar como guardado (reset hasChanges)
    markAsSaved: () => {
      set((state) => {
        state.hasChanges = false;
      });
    },

    // Establecer el estado de cambios
    setHasChanges: (hasChanges) => {
      set((state) => {
        state.hasChanges = hasChanges;
      });
    },

    // Speaker-specific methods
    getSpeakerNodes: () => {
      const { nodes } = get();
      return nodes.filter((node) => node.type === NodeType.SPEAKER);
    },

    prepareSpeakersForSimulation: () => {
      const { nodes, edges } = get();

      // 1. Encontrar el nodo de simulación
      const simulationNode = nodes.find(
        (node) => node.type === NodeType.SIMULATION
      );
      if (!simulationNode) {
        console.warn("No simulation node found");
        return [];
      }

      // 2. Encontrar todos los edges que conectan CON el nodo de simulación
      const connectedEdges = edges.filter(
        (edge) => edge.target === simulationNode.id
      );

      // 3. Obtener los IDs de los nodos conectados (speakers)
      const connectedSpeakerIds = connectedEdges
        .map((edge) => edge.source)
        .filter((sourceId) => {
          const sourceNode = nodes.find((n) => n.id === sourceId);
          return sourceNode?.type === NodeType.SPEAKER;
        });

      // 4. Obtener los nodos de speaker conectados
      const connectedSpeakers = nodes.filter(
        (node) =>
          node.type === NodeType.SPEAKER &&
          connectedSpeakerIds.includes(node.id)
      );

      console.log(
        `Found ${connectedSpeakers.length} speakers connected to simulation`
      );

      // 5. Convertir a formato SpeakerFromDB (compatible con BD)
      return connectedSpeakers.map((node, index) => {
        const catalogData = node.data.catalogData;
        // biome-ignore lint/suspicious/noExplicitAny: Specifications puede tener cualquier estructura
        const specs = catalogData?.specifications as any;

        // Posición por defecto: distribuir parlantes en círculo
        const angle =
          (index / Math.max(connectedSpeakers.length, 1)) * Math.PI * 2;
        const radius = 5; // 5 metros del centro

        return {
          id: `speaker-3d-${node.id}`,
          name: catalogData
            ? `${catalogData.brand || ""} ${
                catalogData.model || catalogData.name || ""
              }`.trim()
            : `Speaker ${node.id}`,
          speakerId: node.data.catalogId || "unknown", // ✅ ESTO ES LO IMPORTANTE: usar catalogId (ej: "jbl-prx418s")
          position: {
            x: Math.cos(angle) * radius,
            y: specs?.dimensions_mm?.height
              ? specs.dimensions_mm.height * 0.001 * 0.5 + 0.5
              : 1.5,
            z: Math.sin(angle) * radius,
          },
          rotation: {
            x: 0,
            y: -angle, // Apuntar hacia el centro
            z: 0,
          },
          specifications: {
            type: specs?.type || "Unknown",
            power_watts_peak: specs?.power_watts_peak,
            power_watts_rms: specs?.power_watts_rms,
            max_spl_db: specs?.max_spl_db,
            frequencyRange_minus_10_db: specs?.frequencyRange_minus_10_db,
            frequencyRange_minus_3_db: specs?.frequencyRange_minus_3_db,
            dispersion: specs?.dispersion || { horizontal: 90, vertical: 60 },
            weight_kg: specs?.weight_kg,
            dimensions_mm: specs?.dimensions_mm || {
              height: 500,
              width: 300,
              depth: 300,
            },
            notes: specs?.notes,
          },
        };
      });
    },
  }))
);

// Helper functions
function getDefaultLabel(type: NodeType): string {
  const labels: Record<NodeType, string> = {
    [NodeType.INSTRUMENT]: "Instrumento",
    [NodeType.MICROPHONE]: "Micrófono",
    [NodeType.MIXER]: "Mezcladora",
    [NodeType.PROCESSOR]: "Procesador",
    [NodeType.SPEAKER]: "Altavoz",
    [NodeType.SIMULATION]: "Simulación",
  };
  return labels[type] || "Nodo";
}
