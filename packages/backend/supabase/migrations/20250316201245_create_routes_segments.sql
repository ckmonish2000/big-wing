-- Route Segments Table (Defines Multi-Leg Flights)
CREATE TABLE "routeSegments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "routeId" UUID REFERENCES "routes"("id") ON DELETE CASCADE,
    "segmentNumber" INT NOT NULL,
    "originId" UUID REFERENCES "locations"("id") ON DELETE CASCADE,
    "destinationId" UUID REFERENCES "locations"("id") ON DELETE CASCADE
);