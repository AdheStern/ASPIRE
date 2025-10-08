// src/components/aspire/editor/sidebar/node-properties.tsx
"use client";

import type { Prisma } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Node } from "reactflow";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateSceneSpeakers } from "@/lib/actions/scene-actions";
import type { BaseNodeData } from "@/lib/stores/editor-store";
import { NodeType, useEditorStore } from "@/lib/stores/editor-store";
import type {
  BaseSpecifications,
  CatalogItem,
  EditorCatalogs,
} from "@/lib/types/catalog";

interface NodePropertiesProps {
  node: Node<BaseNodeData> | null;
  catalogs: EditorCatalogs;
  userId: string;
  onBack?: () => void;
}

export function NodeProperties({
  node,
  catalogs,
  userId,
}: NodePropertiesProps) {
  const { updateNodeData, deleteNode } = useEditorStore();
  const [localData, setLocalData] = useState<BaseNodeData | null>(null);
  const [isSavingSpeakers, setIsSavingSpeakers] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Extraer projectId y sceneId del pathname
  const getRouteParams = () => {
    const parts = pathname.split("/");
    const projectIndex = parts.indexOf("projects");
    const sceneIndex = parts.indexOf("scenes");

    if (projectIndex !== -1 && sceneIndex !== -1) {
      return {
        projectId: parts[projectIndex + 1],
        sceneId: parts[sceneIndex + 1],
      };
    }
    return null;
  };

  useEffect(() => {
    if (node) {
      setLocalData(node.data);
    }
  }, [node]);

  const handleLabelChange = (label: string) => {
    if (!localData || !node) return;
    setLocalData({ ...localData, label });
    updateNodeData(node.id, { label });
  };

  const handleCatalogChange = (catalogId: string) => {
    if (!node || !localData) return;
    const catalog = getCatalogItem(node.type as NodeType, catalogId);
    if (catalog) {
      const newData = {
        ...localData,
        catalogId,
        catalogData: catalog,
        label: catalog.brand
          ? `${catalog.brand} ${catalog.model || catalog.name || ""}`
          : catalog.name || catalog.model || "Sin nombre",
      };
      setLocalData(newData);
      updateNodeData(node.id, newData);
    }
  };

  const handleOpenRoomEditor = async () => {
    const params = getRouteParams();
    if (!params) {
      toast.error("No se pudo obtener la información de la escena");
      return;
    }

    setIsSavingSpeakers(true);

    try {
      // 1. Obtener los parlantes conectados al nodo de simulación
      const speakers = useEditorStore.getState().prepareSpeakersForSimulation();

      console.log(
        `Enviando ${speakers.length} parlantes al editor 3D:`,
        speakers
      );

      // 2. Guardar los parlantes en la base de datos
      const result = await updateSceneSpeakers(
        params.sceneId,
        userId,
        speakers
      );

      if (!result.success) {
        toast.error(result.error || "Error al guardar los parlantes");
        return;
      }

      toast.success(`${speakers.length} parlante(s) enviado(s) al editor 3D`);

      // 3. Guardar cualquier cambio pendiente antes de navegar
      if (node && localData) {
        updateNodeData(node.id, localData);
      }

      // 4. Navegar al editor 3D
      router.push(
        `/projects/${params.projectId}/scenes/${params.sceneId}/room-editor`
      );
    } catch (error) {
      console.error("Error al configurar ambiente:", error);
      toast.error("Error al preparar el editor 3D");
    } finally {
      setIsSavingSpeakers(false);
    }
  };

  const handleDelete = () => {
    if (!node) return;
    deleteNode(node.id);
  };

  const getCatalogItems = (type: NodeType): CatalogItem[] => {
    switch (type) {
      case NodeType.INSTRUMENT:
        return catalogs.instruments;
      case NodeType.SPEAKER:
        return catalogs.speakers;
      case NodeType.MIXER:
        return catalogs.mixers;
      case NodeType.PROCESSOR:
        return catalogs.processors;
      case NodeType.MICROPHONE:
        return catalogs.microphones;
      default:
        return [];
    }
  };

  const getCatalogItem = (
    type: NodeType,
    id: string
  ): CatalogItem | undefined => {
    return getCatalogItems(type).find((item) => item.id === id);
  };

  const renderSpecifications = (
    specs: BaseSpecifications | Prisma.JsonValue | undefined
  ) => {
    if (!specs) return null;

    const specObj = specs as BaseSpecifications;
    if (!specObj || typeof specObj !== "object") return null;

    return (
      <div className="space-y-1 text-xs">
        {specObj.type && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">{specObj.type}</span>
          </div>
        )}
        {specObj.frequencyRange && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rango:</span>
            <span className="font-medium">{specObj.frequencyRange}</span>
          </div>
        )}
        {specObj.channels && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Canales:</span>
            <span className="font-medium">{specObj.channels}</span>
          </div>
        )}
        {specObj.polarPattern && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Patrón:</span>
            <span className="font-medium">{specObj.polarPattern}</span>
          </div>
        )}
        {specObj.powerOutput && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Potencia:</span>
            <span className="font-medium">{specObj.powerOutput}</span>
          </div>
        )}
        {specObj.sensitivity && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sensibilidad:</span>
            <span className="font-medium">{specObj.sensitivity}</span>
          </div>
        )}
        {specObj.impedance && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Impedancia:</span>
            <span className="font-medium">{specObj.impedance}</span>
          </div>
        )}
      </div>
    );
  };

  if (!node || !localData) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground text-center">
          Selecciona un nodo para ver sus propiedades
        </p>
      </div>
    );
  }

  const catalogItems = getCatalogItems(node.type as NodeType);
  const selectedCatalogItem = localData.catalogId
    ? getCatalogItem(node.type as NodeType, localData.catalogId)
    : null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Información básica */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3">
            Información básica
          </h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="node-label">Etiqueta</Label>
              <Input
                id="node-label"
                value={localData.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Nombre del nodo"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>ID del nodo:</span>
                <span className="font-mono">{node.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipo:</span>
                <span className="font-medium">{node.type}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Selector de catálogo */}
        {node.type !== NodeType.SIMULATION && catalogItems.length > 0 && (
          <>
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-3">
                Modelo de equipo
              </h4>
              <Select
                value={localData.catalogId || "none"}
                onValueChange={(value) =>
                  value !== "none" && handleCatalogChange(value)
                }
              >
                <SelectTrigger id="catalog-select">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin modelo</SelectItem>
                  {catalogItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.brand && `${item.brand} - `}
                      {item.model || item.name || "Sin nombre"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCatalogItem?.specifications && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-3">
                    Especificaciones
                  </h4>
                  {renderSpecifications(selectedCatalogItem.specifications)}
                </div>
              </>
            )}
          </>
        )}

        {/* Configuración de simulación */}
        {node.type === NodeType.SIMULATION && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-3">
                Configuración de simulación
              </h4>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenRoomEditor}
                  disabled={isSavingSpeakers}
                >
                  {isSavingSpeakers ? "Cargando..." : "Configurar ambiente"}
                </Button>
                <Button className="w-full" variant="outline" size="sm" disabled>
                  Asignar materiales
                </Button>
                <Separator className="my-3" />
                <Button className="w-full" size="sm" disabled>
                  Ejecutar simulación
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Botón de eliminar */}
        <div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar nodo
          </Button>
        </div>
      </div>
    </div>
  );
}
