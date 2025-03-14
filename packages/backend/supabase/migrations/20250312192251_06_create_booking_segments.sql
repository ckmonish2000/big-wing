CREATE TABLE bookingSegments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bookingId UUID REFERENCES bookings(id) ON DELETE CASCADE,
    segmentId UUID REFERENCES flightSegments(id) ON DELETE CASCADE,
    cabinClass cabinClassEnum NOT NULL,
    seatsReserved INT NOT NULL CHECK (seatsReserved > 0)
);
