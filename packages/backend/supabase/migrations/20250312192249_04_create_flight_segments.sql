CREATE TABLE "flightSegments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "flightId" UUID REFERENCES flights(id) ON DELETE CASCADE,
    "segmentNumber" INT NOT NULL,
    "originId" UUID REFERENCES locations(id) ON DELETE CASCADE,
    "destinationId" UUID REFERENCES locations(id) ON DELETE CASCADE,
    "departureTime" TIMESTAMP NOT NULL,
    "arrivalTime" TIMESTAMP NOT NULL,
    "duration" INTERVAL GENERATED ALWAYS AS ("arrivalTime" - "departureTime") STORED,
    "price" NUMERIC(10,2) NOT NULL,
    "economySeatsAvailable" INT NOT NULL CHECK ("economySeatsAvailable" >= 0),
    "premiumEconomySeatsAvailable" INT NOT NULL CHECK ("premiumEconomySeatsAvailable" >= 0),
    "businessSeatsAvailable" INT NOT NULL CHECK ("businessSeatsAvailable" >= 0),
    "firstClassSeatsAvailable" INT NOT NULL CHECK ("firstClassSeatsAvailable" >= 0)
);
