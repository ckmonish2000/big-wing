const workerFunction = () => {
  self.onmessage = (event) => {
    const { type, data } = event.data;

    switch (type) {
      case "SEARCH_BOOKINGS": {
        const { bookings, searchTerm } = data;
        const searchResults = searchBookings(bookings, searchTerm);
        self.postMessage({ type: "SEARCH_RESULTS", data: searchResults });
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
        field?.toString().toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }
};

const codeToString = workerFunction.toString();

const mainCode = codeToString.substring(
  codeToString.indexOf("{") + 1,
  codeToString.lastIndexOf("}")
);
//convert the code into a raw data
const blob = new Blob([mainCode], { type: "application/javascript" });
//A url is made out of the blob object and we're good to go
const worker_script = URL.createObjectURL(blob);

export default worker_script;
