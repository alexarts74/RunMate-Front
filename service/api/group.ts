import { apiClient } from "./client";

class GroupService {
  async getGroups() {
    try {
      const response = await apiClient.get("/running_groups");
      return response.groups;
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      throw error;
    }
  }
}

export const groupService = new GroupService();
