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
      console.log("=== Début getAllConversations ===");
      const response = await apiClient.get("/messages");
      console.log("Response brute messages:", response);

      if (!response || !Array.isArray(response)) {
        console.log("Response invalide ou vide");
        return [];
      }

      const conversations = response
        .filter((conv: any) => {
          console.log("Conversation brute:", conv);
          const isValid = conv && conv.user;
          if (!isValid) {
            console.log("Conversation invalide ignorée:", conv);
          }
          return isValid;
        })
        .map((conv: any) => {
          console.log("=== Traitement conversation ===");
          console.log("User:", conv.user);
          console.log("Last message from API:", conv.last_message);
          console.log("Unread messages:", conv.unread_messages);

          const lastMessage = conv.last_message ||
            lastMessages?.[conv.user.id] || {
              id: "0",
              content: "Démarrer une conversation",
              created_at: new Date().toISOString(),
              sender: conv.user,
            };

          console.log("Last message final:", lastMessage);

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

      console.log("Conversations triées:", conversations);
      return conversations;
    } catch (error) {
      console.error("=== Erreur dans getAllConversations ===");
      console.error("Type d'erreur:", error?.constructor?.name);
      console.error("Message d'erreur:", error?.message);
      console.error("Stack trace:", error?.stack);
      return [];
    }
  },
};
