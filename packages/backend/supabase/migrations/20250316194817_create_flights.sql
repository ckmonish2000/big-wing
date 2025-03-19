CREATE TABLE "flights" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "airlineId" UUID REFERENCES "airlines"("id") ON DELETE CASCADE,
    "flightNumber" TEXT UNIQUE NOT NULL,
    "flightStatus" flightStatusEnum DEFAULT 'On_Time'
);