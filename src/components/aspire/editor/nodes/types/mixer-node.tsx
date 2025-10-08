// src/components/aspire/editor/nodes/types/mixer-node.tsx
"use client";

import { Sliders } from "lucide-react";
import type { NodeProps } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import type { BaseSpecifications } from "@/lib/types/catalog";
import { BaseNode } from "../base-node";

export function MixerNode(props: NodeProps<BaseNodeData>) {
  // Determinar número de canales basado en el modelo seleccionado
  const getChannelCount = () => {
    // Si no hay catálogo seleccionado, usar valores por defecto
    if (!props.data.catalogId || !props.data.catalogData) {
      return { inputs: 4, outputs: 2 };
    }

    // Extraer información del catálogo
    const specs = props.data.catalogData?.specifications as
      | BaseSpecifications
      | undefined;
    if (specs?.channels) {
      // Para mixers, los canales son las entradas
      // Típicamente tienen 2 salidas (L/R estéreo) o más para auxiliares
      const outputs = specs.auxSends ? 2 + (specs.auxSends || 0) : 2;
      return {
        inputs: specs.channels,
        outputs: outputs,
      };
    }

    // Valores por defecto si no hay información específica
    return { inputs: 4, outputs: 2 };
  };

  const { inputs, outputs } = getChannelCount();

  return (
    <BaseNode
      {...props}
      icon={Sliders}
      color="blue"
      inputs={inputs}
      outputs={outputs}
      requiresCatalog={true}
    />
  );
}
