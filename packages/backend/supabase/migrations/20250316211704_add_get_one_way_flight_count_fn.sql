CREATE OR REPLACE FUNCTION one_way_flight_count(
    originCode TEXT,
    destinationCode TEXT,
    departureDate DATE
) RETURNS INT AS $$
DECLARE 
    totalCount INT;
BEGIN
    SELECT COUNT(*) INTO totalCount
    FROM "flights" f
    JOIN "routes" r ON f."id" = r."flightId"
    JOIN "locations" l1 ON r."originId" = l1."id"
    JOIN "locations" l2 ON r."destinationId" = l2."id"
    JOIN "schedules" s ON r."id" = s."routeId"
    WHERE 
        l1."code" = originCode
        AND l2."code" = destinationCode
        AND s."departureTime" BETWEEN departureDate::TIMESTAMP 
                                  AND departureDate::TIMESTAMP + INTERVAL '1 day';

    RETURN totalCount;
END;
$$ LANGUAGE plpgsql;
