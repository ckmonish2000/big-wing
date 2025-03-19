CREATE TABLE "routes" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "flightId" UUID REFERENCES "flights"("id") ON DELETE CASCADE, -- One flight can have multiple routes
    "originId" UUID REFERENCES "locations"("id") ON DELETE CASCADE,
    "destinationId" UUID REFERENCES "locations"("id") ON DELETE CASCADE,
    "isDirect" BOOLEAN DEFAULT TRUE -- TRUE if it's a non-stop flight
);