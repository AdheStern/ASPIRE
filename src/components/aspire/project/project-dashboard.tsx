"use client";

import { LayoutGrid, List, Plus, Search } from "lucide-react";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/aspire/project/forms/create-project-dialog";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectWithCount } from "@/lib/types/project";
import { ProjectCard } from "./project-card";
import { ProjectEmptyState } from "./project-empty-state";

interface ProjectDashboardProps {
  projects: ProjectWithCount[];
  userId: string;
}

export function ProjectDashboard({
  projects: initialProjects,
  userId,
}: ProjectDashboardProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectCreated = (newProject: ProjectWithCount) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-xl font-semibold">Proyectos</h1>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-6">
        <div className="relative flex-1 max-w-sm rounded-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar un proyecto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <BorderBeam
            duration={6}
            delay={3}
            size={400}
            borderWidth={2}
            className="from-transparent via-green-300 to-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo proyecto
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {filteredProjects.length === 0 ? (
          <ProjectEmptyState
            hasProjects={projects.length > 0}
            onCreateProject={() => setIsCreateOpen(true)}
          />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-2"
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                userId={userId}
                onDelete={handleProjectDeleted}
              />
            ))}
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onProjectCreated={handleProjectCreated}
        userId={userId}
      />
    </div>
  );
}
