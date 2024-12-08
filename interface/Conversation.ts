export interface Message {
  id: string | number;
  content: string;
  created_at: string;
  updated_at?: string; // Maintenant optionnel
  read: boolean;
  sender_id: string | number;
  recipient_id: string | number;
}

export interface ConversationUser {
  id: string | number;
  name: string;
  profile_image: string;
}

export interface Conversation {
  user: ConversationUser;
  unread_messages: number;
  last_message: Message;
}
