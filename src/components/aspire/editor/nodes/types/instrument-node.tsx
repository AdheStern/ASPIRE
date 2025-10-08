// src/components/aspire/editor/nodes/types/instrument-node.tsx
"use client";

import { Guitar } from "lucide-react";
import type { NodeProps } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { BaseNode } from "../base-node";

export function InstrumentNode(props: NodeProps<BaseNodeData>) {
  return (
    <BaseNode {...props} icon={Guitar} color="orange" inputs={0} outputs={1} />
  );
}
