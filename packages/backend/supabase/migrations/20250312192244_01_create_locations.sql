CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,  -- City or Airport Name (e.g., "Los Angeles International Airport")
    code TEXT UNIQUE NOT NULL,  -- IATA/ICAO Airport Code (e.g., "LAX")
    city TEXT NOT NULL,  -- City Name (e.g., "Los Angeles")
    country TEXT NOT NULL  -- Country Name (e.g., "USA")
);
