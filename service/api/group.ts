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
      console.log("getGroupById response:", response);
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

  async getGroupEvents(groupId: string) {
    try {
      const response = await apiClient.get(
        `/running_groups/${groupId}/group_events`
      );
      console.log("Events response:", response);
      return response?.group_events || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      return [];
    }
  }

  async createGroupEvent(groupId: string, eventData: any) {
    try {
      const response = await apiClient.post(
        `/running_groups/${groupId}/group_events`,
        { group_event: eventData }
      );
      return response;
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      throw error;
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
