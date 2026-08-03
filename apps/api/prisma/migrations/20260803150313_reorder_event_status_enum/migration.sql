-- Reorders EventStatus to (live, upcoming, settled, cancelled) so that
-- `ORDER BY status ASC` sorts events by priority (Postgres native enums sort
-- by declaration order, not alphabetically). Same value set as before, so no
-- data is reclassified — only the type's internal ordinal changes.

ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";

CREATE TYPE "EventStatus" AS ENUM ('live', 'upcoming', 'settled', 'cancelled');

ALTER TABLE "Event" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "status" TYPE "EventStatus" USING ("status"::text::"EventStatus");
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'upcoming'::"EventStatus";

DROP TYPE "EventStatus_old";
