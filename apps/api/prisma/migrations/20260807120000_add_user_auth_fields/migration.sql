-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('member', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'member';

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
