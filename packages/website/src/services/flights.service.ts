import * as HttpClient from "@/services/client";

export const searchForFlights = async () => {
  const url = HttpClient.buildUrl("/protected");
  return HttpClient.apiGet(url);
};
