// src/components/aspire/editor/sidebar/node-library.tsx
"use client";

import {
  FlaskConical,
  Guitar,
  Mic,
  Settings2,
  Sliders,
  Speaker,
} from "lucide-react";
import { NodeType } from "@/lib/stores/editor-store";
import type { EditorCatalogs } from "@/lib/types/catalog";
import { cn } from "@/lib/utils";

interface NodeLibraryProps {
  catalogs: EditorCatalogs;
}

const nodeCategories = [
  {
    title: "Entradas",
    nodes: [
      {
        type: NodeType.INSTRUMENT,
        label: "Instrumento",
        icon: Guitar,
        color: "orange",
      },
      {
        type: NodeType.MICROPHONE,
        label: "Micrófono",
        icon: Mic,
        color: "red",
      },
    ],
  },
  {
    title: "Procesamiento",
    nodes: [
      {
        type: NodeType.MIXER,
        label: "Mezcladora",
        icon: Sliders,
        color: "blue",
      },
      {
        type: NodeType.PROCESSOR,
        label: "Procesador",
        icon: Settings2,
        color: "purple",
      },
    ],
  },
  {
    title: "Salidas",
    nodes: [
      {
        type: NodeType.SPEAKER,
        label: "Altavoz",
        icon: Speaker,
        color: "green",
      },
    ],
  },
  {
    title: "Simulación",
    nodes: [
      {
        type: NodeType.SIMULATION,
        label: "Simulación",
        icon: FlaskConical,
        color: "teal",
      },
    ],
  },
];

// Mapeo de colores de Tailwind para evitar purging
const colorClasses = {
  orange: "bg-orange-500/20 text-orange-500",
  red: "bg-red-500/20 text-red-500",
  blue: "bg-blue-500/20 text-blue-500",
  purple: "bg-purple-500/20 text-purple-500",
  green: "bg-green-500/20 text-green-500",
  teal: "bg-teal-500/20 text-teal-500",
};

const dotColorClasses = {
  orange: "bg-orange-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
};

export function NodeLibrary({ catalogs }: NodeLibraryProps) {
  // catalogs se mantendrá para futuras implementaciones donde los nodos
  // se filtren según los catálogos disponibles
  void catalogs;

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleKeyDown = (event: React.KeyboardEvent, nodeType: NodeType) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      console.log("Node selected via keyboard:", nodeType);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">Componentes</h3>
        <p className="text-xs text-muted-foreground mt-1">Arrastra al canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {nodeCategories.map((category) => (
          <div key={category.title}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              {category.title}
            </h4>
            <div className="space-y-2">
              {category.nodes.map((node) => {
                const Icon = node.icon;
                const bgColorClass =
                  colorClasses[node.color as keyof typeof colorClasses];

                return (
                  <button
                    key={node.type}
                    type="button"
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md border bg-card w-full text-left",
                      "cursor-move hover:bg-accent/50 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    )}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                    onKeyDown={(e) => handleKeyDown(e, node.type)}
                    aria-label={`Arrastrar ${node.label}`}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center",
                        bgColorClass.split(" ")[0]
                      )}
                    >
                      <Icon
                        className={cn("h-4 w-4", bgColorClass.split(" ")[1])}
                      />
                    </div>
                    <span className="text-xs font-medium">{node.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={cn("w-2 h-2 rounded-full", dotColorClasses.orange)}
            />
            <span>Instrumentos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", dotColorClasses.red)} />
            <span>Micrófonos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", dotColorClasses.blue)} />
            <span>Mezcla</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn("w-2 h-2 rounded-full", dotColorClasses.purple)}
            />
            <span>Procesamiento</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn("w-2 h-2 rounded-full", dotColorClasses.green)}
            />
            <span>Salida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", dotColorClasses.teal)} />
            <span>Simulación</span>
          </div>
        </div>
      </div>
    </div>
  );
}
