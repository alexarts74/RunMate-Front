import { apiClient } from "./client";

export const authService = {
  async signUp(userData: {
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    console.log("userData", userData);
    return await apiClient.post("/users/sign_up", { user: userData });
  },

  async login(credentials: { email: string; password: string }) {
    return await apiClient.post("/users/log_in", { user: credentials });
  },
};
