import { GroupConversation } from "@/interface/Group";
import { apiClient } from "./client";

class GroupMessageService {
  constructor() {
    console.log("GroupMessageService instancié");
  }

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
        console.log("Response est null/undefined");
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

      console.log("Réponse brute du serveur:", response);
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
    console.log("Début getAllGroupConversations");
    try {
      console.log("Tentative d'appel à /running_groups");
      const response = await apiClient.get("/running_groups");
      console.log("Response brute des groupes:", response);

      if (!response) {
        console.log("Réponse vide de l'API");
        return [];
      }

      if (!Array.isArray(response)) {
        console.log("La réponse n'est pas un tableau:", response);
        return [];
      }

      console.log("Début du mapping des groupes");
      const formattedGroups = response.map((group: any) => {
        console.log("Traitement du groupe:", group);
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

      console.log("Groupes formatés:", formattedGroups);

      const filteredGroups = formattedGroups.filter(
        (group: GroupConversation) => group.is_member === true
      );
      console.log("Groupes filtrés (membres uniquement):", filteredGroups);

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
}

console.log("Création de l'instance groupMessageService");
export const groupMessageService = new GroupMessageService();
console.log("Instance groupMessageService créée:", groupMessageService);
