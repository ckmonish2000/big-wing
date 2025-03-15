import supabase from "@/lib/supabase";
import axios from "axios";

interface ApiOptions {
  params?: Record<string, string>;
  query?: Record<string, string | number | boolean>;
}

const ApiUrl = import.meta.env.VITE_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: ApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const buildUrl = (
  url: string,
  params: Record<string, string> = {},
  queryParams: Record<string, string | number | boolean> = {}
) => {
  let urlWithPrefix = `${ApiUrl}${url}`;
  if (params) {
    Object.keys(params).forEach(
      (key) => (urlWithPrefix = urlWithPrefix.replace(`:${key}`, params[key]))
    );
  }
  const queryParamsWithoutNull: Record<string, string | number | boolean> = {};
  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        queryParamsWithoutNull[key] = queryParams[key];
      }
    });
    const urlSearchParams = new URLSearchParams(
      queryParamsWithoutNull as Record<string, string>
    );
    urlWithPrefix += `?${urlSearchParams.toString()}`;
  }
  return urlWithPrefix;
};

export const apiPost = (
  endpoint: string,
  options?: ApiOptions & { entity?: Record<string, unknown> }
) => {
  const url = buildUrl(endpoint, options.params, options.query);
  return new Promise((resolve, _reject) => {
    apiClient
      .post(url, options.entity)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((e) => {
        resolve({
          status: false,
          message: e.message,
          error: {
            ...e,
            response: {
              ...e.response,
              data: { ...e?.response?.data, ...e?.response?.data?.data },
            },
          },
        });
      });
  });
};

export const apiGet = <T>(endpoint: string, options?: ApiOptions): Promise<T> =>
  new Promise((resolve, _reject) => {
    const url = buildUrl(endpoint, options?.params, options?.query);
    apiClient
      .get(url)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data as T);
        }
      })
      .catch((e) => {
        resolve({
          status: false,
          message: e.message,
          error: {
            ...e,
            response: {
              ...e.response,
              data: { ...e?.response?.data, ...e?.response?.data?.data },
            },
          },
        });
      });
  });

export const apiPut = (
  endpoint: string,
  options?: ApiOptions & { entity?: Record<string, unknown> }
) =>
  new Promise((resolve, reject) => {
    const url = buildUrl(endpoint, options.params, options.query);
    apiClient
      .put(url, options.entity)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((e) => {
        resolve({
          status: false,
          message: e.message,
          error: {
            ...e,
            response: {
              ...e.response,
              data: { ...e?.response?.data, ...e?.response?.data?.data },
            },
          },
        });
      });
  });

export const apiDelete = async (endpoint: string, options?: ApiOptions) => {
  const url = buildUrl(endpoint, options.params, options.query);
  return new Promise((resolve, _reject) => {
    apiClient
      .delete(url)
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((e) => {
        resolve({
          status: false,
          message: e.message,
          error: {
            ...e,
            response: {
              ...e.response,
              data: { ...e?.response?.data, ...e?.response?.data?.data },
            },
          },
        });
      });
  });
};
