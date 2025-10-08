// src/components/aspire/project/project-header.tsx
"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types/project";

interface ProjectHeaderProps {
  project: Project;
  scenesCount: number;
}

export function ProjectHeader({ project, scenesCount }: ProjectHeaderProps) {
  const router = useRouter();

  return (
    <div className="border-b">
      <div className="flex items-center gap-4 p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/aspire")}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <Badge variant="secondary">
              {scenesCount} {scenesCount === 1 ? "escena" : "escenas"}
            </Badge>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {project.description}
            </p>
          )}
        </div>

        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
