import User from "@/interface/User";
import { authStorage } from "../auth/storage";
import { apiClient } from "./client";

export const authService = {
  async signUp(userData: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    age: string;
    gender: string;
    bio: string;
    profile_image: string;
    city: string;
    department: string;
    postcode: string;
    latitude: number;
    longitude: number;
    running_type: string;
  }) {
    return await apiClient.post("/users/sign_up", { user: userData });
  },

  async login(credentials: { email: string; password: string }) {
    return await apiClient.post("/users/log_in", { user: credentials });
  },

  async updateUserProfile(userData: {
    first_name: string;
    last_name: string;
    profile_image: string;
    phone_number: string;
    address: string;
    city: string;
    zip_code: string;
    country: string;
    description: string;
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    try {
      const updateData = {
        user: {
          ...userData,
          current_password: userData.current_password || undefined,
          password: userData.password || undefined,
          password_confirmation: userData.password_confirmation || undefined,
        },
      };
      const response = await apiClient.put("/users/profile", updateData);
      return response;
    } catch (error) {
      console.error("Erreur dans updateUserProfile:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.delete("/users/log_out");
    } catch (error) {
      console.error("Erreur logout:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const token = await authStorage.getToken();

      if (!token) {
        throw new Error("Token non disponible");
      }

      const response = await apiClient.get("/users/current", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  async deleteAccount() {
    return await apiClient.delete("/users/delete_account");
  },

  async updateUserSubscriptionPlan(userData: User) {
    return await apiClient.put("/users/update_subscription_plan", {
      user: {
        ...userData,
        is_premium: userData.is_premium,
      },
    });
  },
};
