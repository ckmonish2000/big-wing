const workerFunction = () => {
  self.onmessage = (event) => {
    const { type, data } = event.data;

    switch (type) {
      case "SEARCH_AND_SORT_BOOKINGS": {
        const { bookings, searchTerm, sortCriteria } = data;
        let results = searchBookings(bookings, searchTerm);
        results = sortBookings(results, sortCriteria);
        self.postMessage({ type: "SEARCH_RESULTS", data: results });
        break;
      }
      default:
        console.warn("Unknown message type:", type);
    }
  };

  function searchBookings(bookings, searchTerm) {
    if (!searchTerm) return bookings;

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return bookings.filter((booking) => {
      // Search through various booking fields
      const searchableFields = [
        booking.id,
        booking.routes.origin.code,
        booking.routes.destination.code,
        booking.flights.airlines.name,
        booking.flights.airlines.code,
        booking.flights.flightNumber,
        booking.bookingStatus,
      ].map((field) => field?.toString().toLowerCase());

      return searchableFields.some((field) =>
        field?.includes(normalizedSearchTerm)
      );
    });
  }

  function sortBookings(bookings, sortCriteria) {
    if (!sortCriteria) return bookings;

    const { option, direction } = sortCriteria;
    const multiplier = direction === "asc" ? 1 : -1;

    return [...bookings].sort((a, b) => {
        const flightDurationA = a.schedules.departureTime - a.schedules.arrivalTime
        const flightDurationB = b.schedules.departureTime - b.schedules.arrivalTime
      switch (option) {
        case "price":
          return (a.totalPrice - b.totalPrice) * multiplier;

        case "duration":
          return (flightDurationA - flightDurationB) * multiplier;

        case "departure":
          return (
            (new Date(a.schedules.departureTime).getTime() -
              new Date(b.schedules.departureTime).getTime()) *
            multiplier
          );

        case "arrival":
          return (
            (new Date(a.schedules.arrivalTime).getTime() -
              new Date(b.schedules.arrivalTime).getTime()) *
            multiplier
          );

        default:
          return 0;
      }
    });
  }
};

const codeToString = workerFunction.toString();
const mainCode = codeToString.substring(
  codeToString.indexOf("{") + 1,
  codeToString.lastIndexOf("}")
);

const blob = new Blob([mainCode], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
