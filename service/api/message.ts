import { Conversation } from "@/interface/Conversation";
import { apiClient } from "./client";
import { GroupConversation } from "@/interface/Group";

// Service de base avec les méthodes communes
const baseMessageService = {
  async markAsRead(messageId: string) {
    const response = await apiClient.put(`/messages/${messageId}`, {
      message: { read: true },
    });
    return response;
  },
};

// Service pour les messages directs
export const directMessageService = {
  ...baseMessageService,

  async getConversation(userId: string) {
    const response = await apiClient.get(`/messages/${userId}`);
    return response.messages;
  },

  async sendMessage(recipientId: string, content: string) {
    const response = await apiClient.post(`/messages`, {
      message: {
        content,
        recipient_id: recipientId,
      },
    });
    return response;
  },

  async getAllConversations() {
    try {
      const response = await apiClient.get("/messages");

      // Récupérer les messages pour chaque conversation
      const conversationsWithMessages = await Promise.all(
        response.map(async (conv: any) => {
          try {
            const messages = await directMessageService.getConversation(
              conv.user.id
            );
            const lastMessage =
              messages && messages.length > 0
                ? {
                    id: messages[messages.length - 1].id,
                    content: messages[messages.length - 1].content,
                    created_at: messages[messages.length - 1].created_at,
                  }
                : {
                    id: 0,
                    content: "Démarrer une conversation",
                    created_at: new Date().toISOString(),
                  };

            return {
              ...conv,
              last_message: lastMessage,
            };
          } catch (error) {
            console.error(
              `Erreur lors de la récupération des messages pour ${conv.user.id}:`,
              error
            );
            return conv;
          }
        })
      );

      return conversationsWithMessages;
    } catch (error) {
      console.error("Erreur dans getAllConversations:", error);
      return [];
    }
  },
};

// Service pour les messages de groupe
export const groupMessageService = {
  ...baseMessageService,

  async getConversation(groupId: string) {
    const response = await apiClient.get(
      `/running_groups/${groupId}/messages/group_index`
    );
    console.log("Response group messages avec id:", response);
    return response.data;
  },

  async sendMessage(groupId: string, content: string) {
    const response = await apiClient.post(
      `/running_groups/${groupId}/messages/create_group_message`,
      { message: { content } }
    );
    return response.data;
  },

  async getAllGroupConversations() {
    try {
      const response = await apiClient.get("/running_groups");

      const memberGroupConversations = response.groups.filter(
        (group: GroupConversation) => group.is_member
      );

      const formattedGroups = memberGroupConversations.map((group: any) => ({
        id: group.id,
        type: "group",
        group: {
          id: group.id,
          name: group.name,
          profile_image: group.profile_image,
          description: group.description,
        },
        last_message: {
          id: group.last_message?.id || 0,
          content: group.last_message?.content || "Aucun message",
          created_at:
            group.last_message?.created_at || new Date().toISOString(),
        },
        unread_messages: group.unread_messages || 0,
      }));

      return formattedGroups;
    } catch (error) {
      console.error("Erreur dans getAllGroupConversations:", error);
      return [];
    }
  },
};
