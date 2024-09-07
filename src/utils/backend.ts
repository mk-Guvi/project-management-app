import { backendRoutes } from "@/constants";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { useRouter } from "next/router";
import { NextApiResponse } from "next/types";

const baseURL: string = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "";
const apiNameKey = "X-API-NAME";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Updated redirect function
const redirect = (url: string, res?: NextApiResponse) => {
  if (typeof window !== "undefined") {
    // Client-side redirect
    window.location.href = url;
  } else if (res) {
    // Server-side redirect
    res.writeHead(307, { Location: url });
    res.end();
  } else {
    // Fallback for server-side without response object
    console.warn("Cannot perform redirect. No response object available.");
  }
};

const clearUser = (res?: NextApiResponse) => {
  // Since we're using cookies, we don't need to clear anything in the frontend
  // The backend should handle clearing the cookies
  redirect("/login", res);
};

axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    return response;
  },
  async (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
     clearUser();
    }
    return Promise.reject(error);
  }
);

interface BackendRequestParams {
  path: string;
  data?: Record<string, any>;
  headers?: {
    [apiNameKey]?: keyof typeof backendRoutes | string;
    [key: string]: any;
  };
  config?: Omit<AxiosRequestConfig, "url" | "data" | "headers">;
}

export const BackendGet = async <T = any>({
  path,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(path, {
      headers,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch from ${path}:`, error);
    throw error;
  }
};

export const BackendPost = async <T = any>({
  path,
  data,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(path, data, {
      headers,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to post to ${path}:`, error);
    throw error;
  }
};

export const BackendDelete = async <T = any>({
  path,
  data,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.delete<T>(path, {
      headers,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete from ${path}:`, error);
    throw error;
  }
};

export const BackendPut = async <T = any>({
  path,
  data,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.put<T>(path, data, {
      headers,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to put to ${path}:`, error);
    throw error;
  }
};
