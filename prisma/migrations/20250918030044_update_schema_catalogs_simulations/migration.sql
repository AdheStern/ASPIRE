/*
  Warnings:

  - You are about to drop the column `dispersionData` on the `SpeakerModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clarityDataId]` on the table `SimulationRun` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instrumentSetup` to the `Scene` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specifications` to the `SpeakerModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Scene" ADD COLUMN     "instrumentSetup" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "public"."SimulationRun" ADD COLUMN     "clarityDataId" TEXT,
ADD COLUMN     "simulationParams" JSONB;

-- AlterTable
ALTER TABLE "public"."SpeakerModel" DROP COLUMN "dispersionData",
ADD COLUMN     "specifications" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "public"."SimulatedClarity" (
    "id" TEXT NOT NULL,
    "d50Data" JSONB,
    "c80Data" JSONB,

    CONSTRAINT "SimulatedClarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MicrophoneModel" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,

    CONSTRAINT "MicrophoneModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InstrumentModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,

    CONSTRAINT "InstrumentModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MixerModel" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,

    CONSTRAINT "MixerModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessorModel" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "specifications" JSONB NOT NULL,

    CONSTRAINT "ProcessorModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MicrophoneModel_id_key" ON "public"."MicrophoneModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentModel_id_key" ON "public"."InstrumentModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MixerModel_id_key" ON "public"."MixerModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessorModel_id_key" ON "public"."ProcessorModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SimulationRun_clarityDataId_key" ON "public"."SimulationRun"("clarityDataId");

-- AddForeignKey
ALTER TABLE "public"."SimulationRun" ADD CONSTRAINT "SimulationRun_clarityDataId_fkey" FOREIGN KEY ("clarityDataId") REFERENCES "public"."SimulatedClarity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
