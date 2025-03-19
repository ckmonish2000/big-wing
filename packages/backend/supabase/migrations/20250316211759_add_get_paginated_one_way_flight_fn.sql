CREATE OR REPLACE FUNCTION "one_way_flights"(
    originCodeParam TEXT,
    destinationCodeParam TEXT,
    departureDateParam DATE,
    pageSizeParam INT,
    pageNumberParam INT
) RETURNS TABLE (
    "flightId" UUID,
    "flightNumber" TEXT,
    "airlineName" TEXT,
    "airlineCode" TEXT,
  	"airlineLogo" TEXT,
    "routeId" UUID,
    "originName" TEXT,
    "originCode" TEXT,
    "destinationName" TEXT,
    "destinationCode" TEXT,
    "scheduleId" UUID,
    "departureTime" TIMESTAMP,
    "arrivalTime" TIMESTAMP,
    "frequency" TEXT,
    "price" NUMERIC,
    "flightStatus" TEXT  -- 🔥 Ensuring flightStatus is TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f."id" AS "flightId",
        f."flightNumber",
        a."name" AS "airlineName",
        a."code" AS "airlineCode",
        "a"."logoUrl" as "airlineLogo",
        r."id" AS "routeId",
        l1."name" AS "originName",
        l1."code" AS "originCode",
        l2."name" AS "destinationName",
        l2."code" AS "destinationCode",
        s."id" AS "scheduleId",
        s."departureTime",
        s."arrivalTime",
        s."frequency",
        s."price",
        f."flightStatus"::TEXT  -- ✅ Explicitly cast to TEXT
    FROM "flights" f
    JOIN "airlines" a ON f."airlineId" = a."id"
    JOIN "routes" r ON f."id" = r."flightId"
    JOIN "locations" l1 ON r."originId" = l1."id"
    JOIN "locations" l2 ON r."destinationId" = l2."id"
    JOIN "schedules" s ON r."id" = s."routeId"
    WHERE 
        l1."code" = originCodeParam
        AND l2."code" = destinationCodeParam
        AND s."departureTime" BETWEEN departureDateParam::TIMESTAMP 
                                  AND departureDateParam::TIMESTAMP + INTERVAL '1 day'
    ORDER BY s."departureTime"
    LIMIT pageSizeParam OFFSET (pageNumberParam - 1) * pageSizeParam;
END;
$$ LANGUAGE plpgsql;