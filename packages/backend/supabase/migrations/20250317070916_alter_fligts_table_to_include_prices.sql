-- Add price column to routes table
ALTER TABLE flights 
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add price column to route segments table
ALTER TABLE "routeSegments"
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

