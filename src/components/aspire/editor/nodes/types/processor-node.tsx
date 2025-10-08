// src/components/aspire/editor/nodes/types/processor-node.tsx
"use client";

import { Settings2 } from "lucide-react";
import type { NodeProps } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { BaseNode } from "../base-node";

export function ProcessorNode(props: NodeProps<BaseNodeData>) {
  // Determinar número de entradas/salidas basado en el modelo seleccionado
  const getIOCount = () => {
    // Si no hay catálogo seleccionado, usar valores por defecto
    if (!props.data.catalogId || !props.data.catalogData) {
      return { inputs: 1, outputs: 1 };
    }

    // Extraer información del catálogo
    const specs = props.data.catalogData?.specifications as
      | Record<string, any>
      | undefined;
    if (specs?.inputs && specs?.outputs) {
      return {
        inputs: specs.inputs,
        outputs: specs.outputs,
      };
    }

    // Valores por defecto si no hay información específica
    return { inputs: 1, outputs: 1 };
  };

  const { inputs, outputs } = getIOCount();

  return (
    <BaseNode
      {...props}
      icon={Settings2}
      color="purple"
      inputs={inputs}
      outputs={outputs}
      requiresCatalog={true}
    />
  );
}
