CREATE TABLE "bookings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- Supabase Auth user relation
    "flightId" UUID NOT NULL REFERENCES "flights"("id") ON DELETE CASCADE,
    "routeId" UUID NOT NULL REFERENCES "routes"("id") ON DELETE CASCADE,
    "scheduleId" UUID NOT NULL REFERENCES "schedules"("id") ON DELETE CASCADE,
    "bookingStatus" bookingStatusEnum NOT NULL DEFAULT 'Pending',  -- ENUM for status
    "totalPrice" NUMERIC NOT NULL CHECK ("totalPrice" >= 0),  -- Final price
    "isReturn" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT NOW()
);
