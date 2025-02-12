import { GroupConversation } from "@/interface/Group";
import { apiClient } from "./client";

class GroupMessageService {
  // Récupérer tous les messages d'un groupe
  async getGroupMessages(groupId: number | string) {
    try {
      if (!groupId) {
        throw new Error("ID du groupe manquant");
      }

      const url = `/running_groups/${groupId}/messages/group_index`;
      const response = await apiClient.get(url);

      // Si response est undefined ou null, retourner une structure par défaut
      if (!response) {
        return {
          group: null,
          messages: [],
        };
      }

      // Si response.data existe, l'utiliser, sinon utiliser response directement
      const data = response.data || response;

      return {
        group: data.group || null,
        messages: Array.isArray(data.messages) ? data.messages : [],
      };
    } catch (error) {
      console.error("=== Erreur dans getGroupMessages ===", error);
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
        `/running_groups/${groupId}/messages`,
        {
          message: {
            content,
            message_type: "group",
            running_group_id: groupId,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Erreur détaillée lors de l'envoi du message au groupe:",
        error
      );
      throw error;
    }
  }

  // Récupérer tous les groupes
  async getAllGroupConversations() {
    try {
      const response = await apiClient.get("/running_groups");

      if (!response) {
        return [];
      }

      if (!Array.isArray(response)) {
        return [];
      }

      const formattedGroups = response.map((group: any) => {
        return {
          id: group.id,
          type: "group",
          name: group.name || group.group?.name || "Sans nom",
          image: group.profile_image || group.group?.profile_image || "",
          is_member: !!group.is_member,
          last_message: {
            id: group.last_message?.id || 0,
            content: group.last_message?.content || "Aucun message",
            created_at:
              group.last_message?.created_at || new Date().toISOString(),
            sender: {
              id: group.last_message?.sender?.id || group.creator?.id || 0,
              first_name:
                group.last_message?.sender?.first_name ||
                group.creator?.first_name ||
                "",
              last_name:
                group.last_message?.sender?.last_name ||
                group.creator?.last_name ||
                "",
              profile_image:
                group.last_message?.sender?.profile_image ||
                group.creator?.profile_image ||
                "",
            },
          },
          unread_messages: Number(group.unread_messages || 0),
          members_count: Number(group.members_count || 0),
          group: {
            id: group.id,
            name: group.name || group.group?.name || "Sans nom",
            description: group.description || group.group?.description || "",
            cover_image: group.cover_image || group.group?.cover_image || "",
          },
        };
      });

      const filteredGroups = formattedGroups
        .filter((group: GroupConversation) => group.is_member === true)
        .sort((a, b) => {
          const dateA = new Date(a.last_message?.created_at || 0).getTime();
          const dateB = new Date(b.last_message?.created_at || 0).getTime();
          return dateB - dateA;
        });

      return filteredGroups;
    } catch (error) {
      console.error("Erreur détaillée dans getAllGroupConversations:", error);
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "No stack trace"
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

  // Récupérer le nombre total de messages non lus pour tous les groupes
  async getUnreadCount() {
    try {
      const conversations = await this.getAllGroupConversations();
      const totalUnread = conversations.reduce(
        (sum, conv) => sum + (conv.unread_messages || 0),
        0
      );
      return totalUnread;
    } catch (error) {
      console.error("Erreur lors du comptage des messages non lus:", error);
      return 0;
    }
  }

  // Marquer tous les messages d'un groupe comme lus
  async markGroupMessagesAsRead(groupId: string | number) {
    try {
      const response = await apiClient.post(
        `/running_groups/${groupId}/messages/mark_as_read`,
        {
          message: {
            read: true,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Erreur lors du marquage des messages comme lus:", error);
      throw error;
    }
  }

  // Mettre à jour le compteur de messages non lus
  async refreshUnreadCount() {
    try {
      const conversations = await this.getAllGroupConversations();
      const unreadCount = conversations.reduce(
        (sum, conv) => sum + (conv.unread_messages || 0),
        0
      );
      return unreadCount;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du compteur:", error);
      return 0;
    }
  }
}

export const groupMessageService = new GroupMessageService();
