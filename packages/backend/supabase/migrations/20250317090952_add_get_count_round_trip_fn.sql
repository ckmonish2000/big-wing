CREATE OR REPLACE FUNCTION "round_trip_flights_count"(
    originCodeParam TEXT,
    destinationCodeParam TEXT,
    departureDateParam DATE,
    returnDateParam DATE
) RETURNS BIGINT AS $$
DECLARE totalCount BIGINT;
BEGIN
    SELECT COUNT(*) INTO totalCount
    FROM (
        WITH outbound AS (
            SELECT 
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
        SELECT COUNT(*) 
        FROM outbound
        JOIN return_flights ON outbound."airlineCode" = return_flights."airlineCode"
    ) AS count_table;

    RETURN totalCount;
END;
$$ LANGUAGE plpgsql;
