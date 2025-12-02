import { GroupInfoCreate, JoinRequest } from "@/interface/Group";
import { apiClient } from "./client";

class GroupService {
  async getGroups() {
    try {
      const response = await apiClient.get("/running_groups");
      if (Array.isArray(response)) {
        return response;
      }
      if (response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      throw error;
    }
  }

  // Nouvel endpoint pour découvrir les groupes
  async discoverGroups(query?: string) {
    try {
      const params = query ? { search: query } : {};
      const response = await apiClient.get("/running_groups/discover", { params });
      
      if (Array.isArray(response)) {
        return response;
      }
      // Gestion des différents formats de réponse possibles
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (response.groups && Array.isArray(response.groups)) {
        return response.groups;
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la recherche des groupes:", error);
      // Pour le dev, si l'endpoint n'existe pas encore, on retourne un tableau vide sans crasher
      return [];
    }
  }

  async createGroup(data: GroupInfoCreate) {
    try {
      const response = await apiClient.post("/running_groups", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(
          "Seuls les organisateurs peuvent créer des groupes. Veuillez créer un compte organisateur pour accéder à cette fonctionnalité."
        );
      }
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création du groupe";
      throw new Error(errorMessage);
      console.error("Erreur lors de la création du groupe:", error);
    }
  }

  async getGroupById(id: string) {
    try {
      const response = await apiClient.get(`/running_groups/${id}`);
      // L'API retourne l'objet directement selon la doc
      return response; // ou response.data si l'intercepteur axios ne le fait pas déjà
    } catch (error) {
      console.error("Erreur détaillée:", error);
      throw error;
    }
  }

  // USER: Demander à rejoindre
  async requestToJoin(groupId: string) {
    try {
      const response = await apiClient.post(
        `/running_groups/${groupId}/request_to_join`,
        {}
      );
      return response;
    } catch (error: any) {
      if (error.message?.includes("422")) {
        throw new Error("Vous avez déjà envoyé une demande ou êtes déjà membre.");
      }
      throw new Error(
        "Impossible d'envoyer la demande. Veuillez réessayer plus tard."
      );
    }
  }

  // USER: Quitter le groupe
  async leaveGroup(groupId: string) {
    try {
      const response = await apiClient.delete(
        `/running_groups/${groupId}/leave`
      );
      return response;
    } catch (error: any) {
      if (error.message?.includes("422")) {
        // Cas spécifique : seul admin restant
        throw new Error("Vous ne pouvez pas quitter le groupe car vous êtes le seul administrateur.");
      }
      throw new Error("Impossible de quitter le groupe");
    }
  }

  // ADMIN: Récupérer les demandes en attente
  async getPendingRequests(groupId: string): Promise<{ requests: JoinRequest[] }> {
    try {
      const response = await apiClient.get(
        `/running_groups/${groupId}/pending_requests`
      );
      return response; 
    } catch (error) {
      console.error("Erreur récupération demandes:", error);
      return { requests: [] };
    }
  }

  // ADMIN: Accepter une demande
  async acceptRequest(groupId: string, userId: number) {
    try {
      const response = await apiClient.post(
        `/running_groups/${groupId}/accept_request`,
        { user_id: userId }
      );
      return response;
    } catch (error) {
      throw new Error("Impossible d'accepter la demande");
    }
  }

  // ADMIN: Refuser une demande
  async declineRequest(groupId: string, userId: number) {
    try {
      // Note: DELETE request with body requires generic config in axios usually, 
      // or passing data property explicitly depending on client setup.
      // Assuming apiClient handles it or we pass { data: { user_id } }
      const response = await apiClient.delete(
        `/running_groups/${groupId}/decline_request`,
        { data: { user_id: userId } }
      );
      return response;
    } catch (error) {
      throw new Error("Impossible de refuser la demande");
    }
  }

  // DEPRECATED or OLD methods kept for backward compat if needed temporarily, 
  // but updated to match new logic if possible.
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
}

export const groupService = new GroupService();
