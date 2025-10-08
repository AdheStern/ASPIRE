// src/lib/types/catalog.ts

import type { Prisma } from "@prisma/client";

export interface BaseSpecifications {
  type?: string;
  frequencyRange?: string;
  channels?: number;
  inputs?: number;
  outputs?: number;
  auxSends?: number;
  polarPattern?: string;
  powerOutput?: string;
  sensitivity?: string;
  impedance?: string;
  [key: string]: any;
}

// Tipo base para items del catálogo desde la BD
export interface CatalogItem {
  id: string;
  name?: string;
  brand?: string;
  model?: string;
  category?: string;
  specifications?: Prisma.JsonValue | BaseSpecifications;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InstrumentCatalog extends CatalogItem {
  type?: "INSTRUMENT";
}

export interface SpeakerCatalog extends CatalogItem {
  type?: "SPEAKER";
}

export interface MixerCatalog extends CatalogItem {
  type?: "MIXER";
}

export interface ProcessorCatalog extends CatalogItem {
  type?: "PROCESSOR";
}

export interface MicrophoneCatalog extends CatalogItem {
  type?: "MICROPHONE";
}

export type AnyCatalog =
  | InstrumentCatalog
  | SpeakerCatalog
  | MixerCatalog
  | ProcessorCatalog
  | MicrophoneCatalog;

export interface EditorCatalogs {
  instruments: InstrumentCatalog[];
  speakers: SpeakerCatalog[];
  mixers: MixerCatalog[];
  processors: ProcessorCatalog[];
  microphones: MicrophoneCatalog[];
}
