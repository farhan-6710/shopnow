import { API_URL } from "@/constants/api";
import { axiosInstance } from "./axiosInstance";
export interface AuthResponse {
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
  token?: string;
  error?: string;
}

export const authApi = {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance({
      method: API_URL.AUTH.LOGIN.type,
      url: API_URL.AUTH.LOGIN.url,
      data: { email, password },
    });
    return response.data;
  },

  /**
   * Signup user
   */
  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse> {
    const response = await axiosInstance({
      method: API_URL.AUTH.SIGNUP.type,
      url: API_URL.AUTH.SIGNUP.url,
      data: { email, password, name },
    });
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const response = await axiosInstance({
      method: API_URL.AUTH.LOGOUT.type,
      url: API_URL.AUTH.LOGOUT.url,
    });
    return response.data;
  },

  /**
   * Get current auth user
   */
  async me(): Promise<AuthResponse> {
    const response = await axiosInstance({
      method: API_URL.AUTH.ME.type,
      url: API_URL.AUTH.ME.url,
    });
    return response.data;
  },
};
