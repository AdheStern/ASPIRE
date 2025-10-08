// src/components/aspire/editor/nodes/types/simulation-node.tsx
"use client";

import { FlaskConical } from "lucide-react";
import type { NodeProps } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { BaseNode } from "../base-node";

export function SimulationNode(props: NodeProps<BaseNodeData>) {
  return (
    <BaseNode
      {...props}
      icon={FlaskConical}
      color="teal"
      inputs={1}
      outputs={0}
      showLabel={true}
    />
  );
}
