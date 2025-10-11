// src/components/aspire/simulation/panels/dock-toolbar.tsx
"use client";

import { Box, MousePointer2, Move, RotateCw, Speaker } from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EditorMode, Tool } from "@/lib/three/types/editor.types";

interface DockToolbarProps {
  selectedTool: Tool;
  onToolChange: (tool: Tool) => void;
  editorMode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

const modes: Array<{
  id: EditorMode;
  icon: any;
  label: string;
}> = [
  { id: "geometry", icon: Box, label: "Geometría" },
  { id: "speakers", icon: Speaker, label: "Speakers" },
];

const tools: Array<{
  id: Tool;
  icon: any;
  label: string;
  shortcut: string;
}> = [
  { id: "select", icon: MousePointer2, label: "Seleccionar", shortcut: "Q" },
  { id: "move", icon: Move, label: "Mover", shortcut: "W" },
  { id: "rotate", icon: RotateCw, label: "Rotar", shortcut: "E" },
];

export function DockToolbar({
  selectedTool,
  onToolChange,
  editorMode,
  onModeChange,
}: DockToolbarProps) {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <TooltipProvider>
        <Dock direction="middle">
          {/* Modos: Geometry / Speakers */}
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = editorMode === mode.id;

            return (
              <DockIcon key={mode.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onModeChange(mode.id)}
                      className={`
                        flex items-center justify-center
                        w-10 h-10 rounded-full
                        transition-all duration-200
                        ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-lg scale-110"
                            : "bg-background text-foreground hover:bg-accent hover:scale-105"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">{mode.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            );
          })}

          {/* Separator visual */}
          <DockIcon>
            <div className="w-px h-8 bg-border mx-2" />
          </DockIcon>

          {/* Herramientas */}
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            const isDisabled =
              tool.id === "rotate" && editorMode === "geometry";

            return (
              <DockIcon key={tool.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => !isDisabled && onToolChange(tool.id)}
                      disabled={isDisabled}
                      className={`
                        flex items-center justify-center
                        w-10 h-10  rounded-full
                        transition-all duration-200
                        ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed bg-background"
                            : isSelected
                            ? "bg-primary text-primary-foreground shadow-lg scale-110"
                            : "bg-background text-foreground hover:bg-accent hover:scale-105"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-medium">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">
                      Atajo: {tool.shortcut}
                    </p>
                    {isDisabled && (
                      <p className="text-xs text-red-400">
                        No disponible en modo geometría
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            );
          })}
        </Dock>
      </TooltipProvider>
    </div>
  );
}
