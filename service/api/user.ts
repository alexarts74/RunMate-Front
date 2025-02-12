import { apiClient } from "./client";

class UserService {
  async searchUsers(query: string) {
    try {
      const response = await apiClient.get(
        `/users/search_users?query=${query}`
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
  }
}

export const userService = new UserService();
