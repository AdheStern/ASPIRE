// src/components/aspire/editor/nodes/base-node.tsx
"use client";

import { memo } from "react";
import { Handle, type NodeProps, Position } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { cn } from "@/lib/utils";

interface BaseNodeProps extends NodeProps<BaseNodeData> {
  icon: React.ElementType;
  color: string;
  inputs?: number;
  outputs?: number;
  showLabel?: boolean;
  requiresCatalog?: boolean;
}

const colorVariants = {
  orange: "border-orange-500 bg-orange-500/10 text-orange-500",
  red: "border-red-500 bg-red-500/10 text-red-500",
  blue: "border-blue-500 bg-blue-500/10 text-blue-500",
  purple: "border-purple-500 bg-purple-500/10 text-purple-500",
  green: "border-green-500 bg-green-500/10 text-green-500",
  teal: "border-teal-500 bg-teal-500/10 text-teal-500",
};

export const BaseNode = memo(
  ({
    data,
    selected,
    icon: Icon,
    color,
    inputs = 1,
    outputs = 1,
    showLabel = true,
    requiresCatalog = false,
  }: BaseNodeProps) => {
    const colorClass = colorVariants[color as keyof typeof colorVariants];

    // Calcular el ancho del nodo basado en el número de entradas/salidas
    // Espacio mínimo entre handles: 30px para evitar solapamiento
    const maxConnections = Math.max(inputs, outputs);
    const minSpacing = 30; // Espacio mínimo entre handles
    const padding = 40; // Padding adicional a los lados
    const nodeWidth = Math.max(120, maxConnections * minSpacing + padding);

    // Verificar si el nodo requiere catálogo y no lo tiene
    const needsCatalog = requiresCatalog && !data.catalogId;

    return (
      <div
        className={cn(
          "relative rounded-lg border-2 bg-background p-3 shadow-sm transition-all",
          colorClass,
          selected && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
        style={{
          minWidth: `${nodeWidth}px`,
        }}
      >
        {/* Output handles - ARRIBA */}
        {outputs > 0 &&
          Array.from({ length: outputs }).map((_, index) => {
            const handleId = `output-${index}`;
            const percentage =
              outputs === 1 ? 50 : 15 + (index * 70) / (outputs - 1); // Distribuir entre 15% y 85%

            return (
              <div key={handleId}>
                <Handle
                  type="source"
                  position={Position.Top}
                  id={handleId}
                  style={{
                    left: `${percentage}%`,
                  }}
                  className={cn(
                    "!w-3 !h-3 !border-2",
                    "!bg-background !border-current",
                    "hover:!bg-current transition-colors"
                  )}
                />
                {/* Número del output */}
                <span
                  className="absolute text-[9px] font-mono font-bold pointer-events-none select-none"
                  style={{
                    left: `${percentage}%`,
                    top: "-18px",
                    transform: "translateX(-50%)",
                  }}
                >
                  {index + 1}
                </span>
              </div>
            );
          })}

        {/* Node content */}
        <div className="flex flex-col items-center gap-2 my-2">
          <Icon className="h-6 w-6" />
          {showLabel && (
            <span className="text-xs font-medium text-foreground text-center">
              {data.label}
            </span>
          )}
          {needsCatalog && (
            <span className="text-[10px] text-yellow-600 dark:text-yellow-500 font-medium">
              ⚠ Selecciona modelo
            </span>
          )}
        </div>

        {/* Input handles - ABAJO */}
        {inputs > 0 &&
          Array.from({ length: inputs }).map((_, index) => {
            const handleId = `input-${index}`;
            const percentage =
              inputs === 1 ? 50 : 15 + (index * 70) / (inputs - 1); // Distribuir entre 15% y 85%

            return (
              <div key={handleId}>
                <Handle
                  type="target"
                  position={Position.Bottom}
                  id={handleId}
                  style={{
                    left: `${percentage}%`,
                  }}
                  className={cn(
                    "!w-3 !h-3 !border-2",
                    "!bg-background !border-current",
                    "hover:!bg-current transition-colors"
                  )}
                />
                {/* Número del input */}
                <span
                  className="absolute text-[9px] font-mono font-bold pointer-events-none select-none"
                  style={{
                    left: `${percentage}%`,
                    bottom: "-18px",
                    transform: "translateX(-50%)",
                  }}
                >
                  {index + 1}
                </span>
              </div>
            );
          })}
      </div>
    );
  }
);

BaseNode.displayName = "BaseNode";
