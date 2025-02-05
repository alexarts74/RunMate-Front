import { apiClient } from "./client";

class GroupService {
  async getGroups() {
    try {
      const response = await apiClient.get("/running_groups");
      // Si response est directement le tableau de groupes
      if (Array.isArray(response)) {
        return response;
      }

      // Si les données sont dans response.data
      if (response.data) {
        return response.data;
      }

      return []; // Retourne un tableau vide si pas de données
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      throw error;
    }
  }

  async createGroup(data: {
    name: string;
    description: string;
    location: string;
    max_members: number;
    level: string;
  }) {
    try {
      const response = await apiClient.post("/running_groups", data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      throw error;
    }
  }

  async getGroupById(id: string) {
    try {
      const response = await apiClient.get(`/running_groups/${id}`);
      return response;
    } catch (error) {
      console.error("Erreur détaillée:", error);
      throw error;
    }
  }

  async joinGroup(groupId: string) {
    try {
      const response = await apiClient.post(
        `/running_groups/${groupId}/join`,
        {}
      );
      return response;
    } catch (error: any) {
      if (error.message?.includes("422")) {
        throw new Error("Vous êtes déjà membre de ce groupe");
      }
      throw new Error(
        "Impossible de rejoindre le groupe. Veuillez réessayer plus tard."
      );
    }
  }

  async getGroupMembers(groupId: string) {
    try {
      const response = await apiClient.get(`/running_groups/${groupId}`);
      return response.members || [];
    } catch (error) {
      console.error("Erreur détaillée:", error);
      return [];
    }
  }

  async joinEvent(groupId: string, eventId: string) {
    try {
      const response = await apiClient.post(
        `/running_groups/${groupId}/group_events/${eventId}/join`,
        {}
      );
      return response;
    } catch (error: any) {
      if (error.message?.includes("422")) {
        throw new Error("Vous participez déjà à cet événement");
      }
      throw new Error("Impossible de rejoindre l'événement");
    }
  }

  async leaveGroup(groupId: string) {
    try {
      const response = await apiClient.delete(
        `/running_groups/${groupId}/leave`
      );
      return response;
    } catch (error: any) {
      if (error.message?.includes("422")) {
        throw new Error("Vous n'êtes pas membre de ce groupe");
      }
      throw new Error("Impossible de quitter le groupe");
    }
  }
}

export const groupService = new GroupService();
