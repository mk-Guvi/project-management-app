import { backendRoutes } from "@/constants";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { redirect } from "next/navigation";


const baseURL: string = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "";
const apiNameKey = "X-API-NAME";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const clearUser = () => {
  // Since we're using cookies, we don't need to clear anything in the frontend
  // The backend should handle clearing the cookies
  redirect("/login");
};

axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // We don't need to manually add tokens here as cookies are automatically sent
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    return response;
  },
  async (error: AxiosError): Promise<never> => {
    
    if (error.response?.status === 401 ) {
      clearUser();
    }
    return Promise.reject(error);
  }
);

interface BackendRequestParams {
  path: string;
  data?: Record<string, any>;
  headers?: { [apiNameKey]?: keyof typeof backendRoutes | string; [key: string]: any };
  config?: Omit<AxiosRequestConfig, "url" | "data" | "headers">;
}

export const BackendGet = async <T = any>({
  path,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  const response = await axiosInstance.get<T>(path, {
    headers,
    ...config,
  });
  return response.data;
};

export const BackendPost = async <T = any>({
  path,
  data,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  const response = await axiosInstance.post<T>(path, data, {
    headers,
    ...config,
  });
  return response.data;
};

export const BackendDelete = async <T = any>({
  path,
  data,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  const response = await axiosInstance.delete<T>(path, {
    headers,
    data,
    ...config,
  });
  return response.data;
};

export const BackendPut = async <T = any>({
  path,
  data,
  headers = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  const response = await axiosInstance.put<T>(path, data, {
    headers,
    ...config,
  });
  return response.data;
};

