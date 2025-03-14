CREATE TYPE cabinClassEnum AS ENUM ('Economy', 'Premium_Economy', 'Business', 'First');
CREATE TYPE flightStatusEnum AS ENUM ('On_Time', 'Delayed', 'Cancelled', 'Departed', 'Landed');

CREATE TABLE flights (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "airlineId" UUID REFERENCES airlines(id) ON DELETE CASCADE,
    "flightNumber" TEXT UNIQUE NOT NULL,
    "originId" UUID REFERENCES locations(id) ON DELETE CASCADE,
    "destinationId" UUID REFERENCES locations(id) ON DELETE CASCADE,
    "totalDuration" INTERVAL DEFAULT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "cabinClass" cabinClassEnum NOT NULL,
    "flightStatus" flightStatusEnum DEFAULT 'On_Time'
);
