CREATE TYPE bookingStatusEnum AS ENUM ('Confirmed', 'Cancelled', 'Pending');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth Users
    departureFlightId UUID REFERENCES flights(id) ON DELETE CASCADE,
    returnFlightId UUID REFERENCES flights(id),  -- NULL if one-way trip
    departureOriginId UUID REFERENCES locations(id) ON DELETE CASCADE,
    departureDestinationId UUID REFERENCES locations(id) ON DELETE CASCADE,
    returnOriginId UUID REFERENCES locations(id) ON DELETE CASCADE,
    returnDestinationId UUID REFERENCES locations(id) ON DELETE CASCADE,
    totalPrice NUMERIC(10,2) NOT NULL,
    bookingStatus bookingStatusEnum DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT now()
);
