-- DROP FUNCTION IF EXISTS "round_trip_flights"(
--     TEXT, TEXT, DATE, DATE, INT, INT
-- );
CREATE OR REPLACE FUNCTION "round_trip_flights"(
    originCodeParam TEXT,
    destinationCodeParam TEXT,
    departureDateParam DATE,
    returnDateParam DATE,
    pageSizeParam INT,
    pageNumberParam INT
) RETURNS TABLE (
    "from" JSONB,
    "return" JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH outbound AS (
        SELECT 
            jsonb_build_object(
                'flightId', f."id",
                'flightNumber', f."flightNumber",
                'airlineName', a."name",
                'airlineCode', a."code",
                'airlineLogo', a."logoUrl",
                'routeId', r."id",
                'originName', l1."name",
                'originCode', l1."code",
                'destinationName', l2."name",
                'destinationCode', l2."code",
                'scheduleId', s."id",
                'departureTime', s."departureTime",
                'arrivalTime', s."arrivalTime",
                'frequency', s."frequency",
                'price', f."price",
                'flightStatus', f."flightStatus"
            ) AS "from",
            a."code" AS "airlineCode"
        FROM "flights" f
        JOIN "airlines" a ON f."airlineId" = a."id"
        JOIN "routes" r ON f."id" = r."flightId"
        JOIN "locations" l1 ON r."originId" = l1."id"
        JOIN "locations" l2 ON r."destinationId" = l2."id"
        JOIN "schedules" s ON r."id" = s."routeId"
        WHERE l1."code" = originCodeParam  
          AND l2."code" = destinationCodeParam  
          AND s."departureTime" BETWEEN departureDateParam::TIMESTAMP 
                                    AND departureDateParam::TIMESTAMP + INTERVAL '1 day'
    ),
    return_flights AS (
        SELECT 
            jsonb_build_object(
                'flightId', f."id",
                'flightNumber', f."flightNumber",
                'airlineName', a."name",
                'airlineCode', a."code",
                'airlineLogo', a."logoUrl",
                'routeId', r."id",
                'originName', l1."name",
                'originCode', l1."code",
                'destinationName', l2."name",
                'destinationCode', l2."code",
                'scheduleId', s."id",
                'departureTime', s."departureTime",
                'arrivalTime', s."arrivalTime",
                'frequency', s."frequency",
                'price', f."price",
                'flightStatus', f."flightStatus"
            ) AS "return",
            a."code" AS "airlineCode"
        FROM "flights" f
        JOIN "airlines" a ON f."airlineId" = a."id"
        JOIN "routes" r ON f."id" = r."flightId"
        JOIN "locations" l1 ON r."originId" = l1."id"
        JOIN "locations" l2 ON r."destinationId" = l2."id"
        JOIN "schedules" s ON r."id" = s."routeId"
        WHERE l1."code" = destinationCodeParam  
          AND l2."code" = originCodeParam  
          AND s."departureTime" BETWEEN returnDateParam::TIMESTAMP 
                                    AND returnDateParam::TIMESTAMP + INTERVAL '1 day'
    )
    SELECT outbound."from", return_flights."return"
    FROM outbound
    JOIN return_flights ON outbound."airlineCode" = return_flights."airlineCode"
    LIMIT pageSizeParam OFFSET (pageNumberParam - 1) * pageSizeParam;
END;
$$ LANGUAGE plpgsql;