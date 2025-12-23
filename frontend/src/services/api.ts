import axios, { AxiosInstance, AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  async setToken(token: string) {
    this.token = token;
    try {
      await SecureStore.setItemAsync("authToken", token);
    } catch {
      // Silently fail - keep in memory
    }
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    try {
      this.token = await SecureStore.getItemAsync("authToken");
      return this.token;
    } catch {
      return null;
    }
  }

  async clearToken() {
    this.token = null;
    try {
      await SecureStore.deleteItemAsync("authToken");
    } catch {
      // Silently fail
    }
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }

  postFormData<T>(url: string, formData: FormData, config?: any) {
    return this.client.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...(config?.headers || {}),
      },
    });
  }
}

export const apiClient = new APIClient();
