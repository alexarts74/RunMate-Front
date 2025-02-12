export interface GroupMember {
  id: number;
  name: string;
  profile_image: string;
  is_admin: boolean;
}

export interface GroupInfo {
  id: number;
  first_name: string;
  name?: string;
  members: GroupMember[];
  total_members: number;
  cover_image: string;
}

export interface GroupInfoCreate {
  name: string;
  description: string;
  location: string;
  max_members: number;
  level: string;
}

export interface GroupMessage {
  id: number;
  content: string;
  created_at: string;
  sender: {
    id: number;
    first_name: string;
    profile_image: string;
  };
}

export interface GroupChatData {
  group: GroupInfo;
  messages: GroupMessage[];
}

// Pour la liste des groupes
export interface GroupConversation {
  id: number;
  type: "group";
  name: string;
  image: string;
  last_message: {
    id: number;
    content: string;
    created_at: string;
    sender: {
      id: number;
      first_name: string;
      profile_image: string;
    };
  };
  unread_messages: number;
  members_count: number;
  is_member: boolean;
}
