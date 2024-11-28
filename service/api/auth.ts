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

  async updateUserProfile(userData: {
    name: string;
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
      console.log("Données avant transformation:", userData);

      const updateData = {
        user: {
          ...userData,
          current_password: userData.current_password || undefined,
          password: userData.password || undefined,
          password_confirmation: userData.password_confirmation || undefined,
        },
      };
      console.log("Données envoyées à l'API:", updateData);

      const response = await apiClient.put("/users/profile", updateData);
      console.log("Réponse de l'API:", response);

      return response;
    } catch (error) {
      console.error("Erreur dans updateUserProfile:", error);
      throw error;
    }
  },
};
