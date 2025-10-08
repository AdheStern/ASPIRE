// src/components/aspire/editor/nodes/types/microphone-node.tsx
"use client";

import { Mic } from "lucide-react";
import type { NodeProps } from "reactflow";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { BaseNode } from "../base-node";

export function MicrophoneNode(props: NodeProps<BaseNodeData>) {
  return <BaseNode {...props} icon={Mic} color="red" inputs={1} outputs={1} />;
}
