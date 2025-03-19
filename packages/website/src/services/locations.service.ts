import * as HttpClient from "@/services/client";
import { ApiResponse, PaginatedResponse, Location } from "@big-wing/common";

type PaginatedLocation = PaginatedResponse<Location>;

export const getLocations = async ({ page = 1, search }) => HttpClient.apiGet<ApiResponse<PaginatedLocation>>(
    "/locations",
    {
      query: {
        page,
        search,
      },
    }
  );
