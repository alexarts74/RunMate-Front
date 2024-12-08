import { apiClient } from "./client";

type Conversation = {
  user: {
    id: string;
    name: string;
    profile_image: string;
  };
  unread_messages: number;
  last_message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    recipient_id: string;
    read: boolean;
  };
};

const messageService = {
  async getAllConversations(): Promise<Conversation[]> {
    const response = await apiClient.get("/messages");
    return response;
  },

  async getConversation(userId: string) {
    const response = await apiClient.get(`/messages/${userId}`);
    return response.messages;
  },

  async sendMessage(recipientId: string, content: string) {
    const response = await apiClient.post(`/messages`, {
      message: {
        content,
        recipient_id: recipientId
      }
    });
    return response;
  }
};

export default messageService;
