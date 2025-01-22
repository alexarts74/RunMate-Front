import { GroupConversation } from "@/interface/Group";
import { apiClient } from "./client";

class GroupMessageService {
  // Récupérer tous les messages d'un groupe
  async getGroupMessages(groupId: number | string) {
    try {
      if (!groupId) {
        throw new Error("ID du groupe manquant");
      }

      const response = await apiClient.get(
        `/running_groups/${groupId}/messages/group_index`
      );

      // Si response.data est undefined, retourner une structure par défaut
      if (!response.data) {
        return {
          group: null,
          messages: [],
        };
      }

      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des messages du groupe:",
        error
      );
      // En cas d'erreur, retourner une structure par défaut
      return {
        group: null,
        messages: [],
      };
    }
  }

  // Envoyer un message au groupe
  async sendGroupMessage(groupId: number | string, content: string) {
    try {
      if (!groupId) {
        throw new Error("ID du groupe manquant");
      }

      const response = await apiClient.post(
        `/running_groups/${groupId}/messages/create_group_message`,
        { message: { content } }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message au groupe:", error);
      throw error;
    }
  }

  // Récupérer tous les groupes
  async getAllGroupConversations() {
    try {
      const response = await apiClient.get("/running_groups");
      console.log("Response brute des groupes:", response);

      // Formater les données pour correspondre à la structure attendue
      const formattedGroups = response.map((group: any) => ({
        id: group.id,
        type: "group",
        name: group.name || group.group.name,
        image: group.profile_image || group.group.profile_image,
        is_member: group.is_member, // On utilise la valeur du backend
        last_message: {
          id: group.last_message?.id || 0,
          content: group.last_message?.content || "Aucun message",
          created_at:
            group.last_message?.created_at || new Date().toISOString(),
          sender: group.creator || {
            id: 0,
            first_name: "",
            profile_image: "",
          },
        },
        unread_messages: group.unread_messages || 0,
        members_count: group.members_count || 0,
        group: {
          id: group.id,
          name: group.name || group.group.name,
          description: group.description || group.group.description,
          profile_image: group.profile_image || group.group.profile_image,
        },
      }));

      // On ne retourne que les groupes où is_member est explicitement true
      return formattedGroups.filter(
        (group: GroupConversation) => group.is_member === true
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des conversations de groupe:",
        error
      );
      return [];
    }
  }

  // Marquer un message de groupe comme lu
  async markAsRead(messageId: string) {
    const response = await apiClient.put(`/running_groups/${messageId}`, {
      message: { read: true },
    });
    return response;
  }
}

export const groupMessageService = new GroupMessageService();
