ALTER TABLE "schedules"
ADD COLUMN "departureTimestamp" TIMESTAMP DEFAULT NOW(),
ADD COLUMN "arrivalTimestamp" TIMESTAMP DEFAULT NOW();

UPDATE "schedules"
SET "departureTimestamp" = ('2024-06-01' || ' ' || "departureTime")::TIMESTAMP,
    "arrivalTimestamp" = ('2024-06-01' || ' ' || "arrivalTime")::TIMESTAMP;

ALTER TABLE "schedules" DROP COLUMN "departureTime", DROP COLUMN "arrivalTime";
ALTER TABLE "schedules" RENAME COLUMN "departureTimestamp" TO "departureTime";
ALTER TABLE "schedules" RENAME COLUMN "arrivalTimestamp" TO "arrivalTime";
