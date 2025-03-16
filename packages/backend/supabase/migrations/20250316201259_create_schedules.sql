CREATE TABLE "schedules" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "routeId" UUID REFERENCES "routes"("id") ON DELETE CASCADE, -- Linked to route instead of segment
    "departureTime" TIME NOT NULL,
    "arrivalTime" TIME NOT NULL,
    "frequency" TEXT CHECK ("frequency" IN ('Daily', 'Weekly', 'Bi-Weekly')) DEFAULT 'Daily',
    "price" NUMERIC(10,2) NOT NULL
);