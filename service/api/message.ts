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
      console.log("Response brute messages:", response);

      if (!response || !Array.isArray(response)) {
        return [];
      }

      return response
        .filter((conv: any) => conv && conv.user)
        .map((conv: any) => {
          const lastMessage = lastMessages?.[conv.user.id] || {
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
        });
    } catch (error) {
      console.error("Erreur dans getAllConversations:", error);
      return [];
    }
  },
};
