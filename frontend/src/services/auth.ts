import { apiClient } from "./api";
import { AuthResponse, User } from "../types";

export const authService = {
  async signup(
    name: string,
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signup", {
      username,
      email,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.get<{ success: boolean; data: User }>("/auth/me");
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: User }> {
    const response = await apiClient.put<{ success: boolean; data: User }>("/users/profile", data);
    return response.data;
  },

  async logout() {
    await apiClient.clearToken();
  },
};
