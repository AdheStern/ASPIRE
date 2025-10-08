// src/components/aspire/editor/nodes/types/speaker-node.tsx
"use client";

import { Speaker } from "lucide-react";
import type { NodeProps } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { BaseNode } from "../base-node";

export function SpeakerNode(props: NodeProps<BaseNodeData>) {
  return (
    <BaseNode {...props} icon={Speaker} color="green" inputs={1} outputs={1} />
  );
}
