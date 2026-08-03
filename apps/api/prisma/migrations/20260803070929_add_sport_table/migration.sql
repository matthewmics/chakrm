/*
  Warnings:

  - You are about to drop the column `isEsport` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `sportType` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `sportId` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tournament_sportType_idx";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "isEsport",
DROP COLUMN "sportType",
ADD COLUMN     "sportId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Sport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isEsport" BOOLEAN NOT NULL DEFAULT false,
    "iconUrl" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sport_name_key" ON "Sport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sport_slug_key" ON "Sport"("slug");

-- CreateIndex
CREATE INDEX "Tournament_sportId_idx" ON "Tournament"("sportId");

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
