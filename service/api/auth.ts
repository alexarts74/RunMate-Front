import { apiClient } from "./client";

export const authService = {
  async signUp(userData: {
    email: string;
    password: string;
    password_confirmation: string;
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
      console.log("Déconnexion dans le service");
      await apiClient.delete("/users/log_out");
    } catch (error) {
      console.error('Erreur logout:', error);
      throw error;
    }
  },
};
