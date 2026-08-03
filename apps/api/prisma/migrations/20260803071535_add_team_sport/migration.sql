-- CreateTable
CREATE TABLE "TeamSport" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "sportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamSport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamSport_teamId_sportId_key" ON "TeamSport"("teamId", "sportId");

-- AddForeignKey
ALTER TABLE "TeamSport" ADD CONSTRAINT "TeamSport_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamSport" ADD CONSTRAINT "TeamSport_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
