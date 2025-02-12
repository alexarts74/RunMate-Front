import { Conversation } from "@/interface/Conversation";
import { apiClient } from "./client";

// Service de base avec les méthodes communes
const baseMessageService = {
  async markAsRead(messageId: string) {
    const response = await apiClient.put(`/messages/${messageId}`, {
      message: { read: true },
    });
    return response;
  },
};

// Service pour les messages directs uniquement
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

  async getAllConversations(lastMessages?: {
    [key: string]: any;
  }): Promise<Conversation[]> {
    try {
      const response = await apiClient.get("/messages");

      if (!response || !Array.isArray(response)) {
        return [];
      }

      const conversations = response
        .filter((conv: any) => {
          const isValid = conv && conv.user;
          if (!isValid) {
            return false;
          }
          return isValid;
        })
        .map((conv: any) => {
          const lastMessage = conv.last_message ||
            lastMessages?.[conv.user.id] || {
              id: "0",
              content: "Démarrer une conversation",
              created_at: new Date().toISOString(),
              sender: conv.user,
            };

          return {
            id: conv.user.id,
            type: "individual",
            name: conv.user.first_name,
            image: conv.user.profile_image,
            last_message: lastMessage,
            unread_messages: conv.unread_messages || 0,
            user: conv.user,
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.last_message?.created_at || 0).getTime();
          const dateB = new Date(b.last_message?.created_at || 0).getTime();
          return dateB - dateA;
        });

      return conversations;
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
      return [];
    }
  },
};
