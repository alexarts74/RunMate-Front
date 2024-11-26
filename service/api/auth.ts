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

  async updateUser(userData: {
    first_name: string;
    last_name: string;
    profile_image: string;
    phone_number: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    description: string;
  }) {
    return await apiClient.put("/users/profile", { user: userData });
  },
};
