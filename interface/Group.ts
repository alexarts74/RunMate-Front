export interface GroupMember {
  id: number;
  first_name: string; // Changed from name to match API user object usually
  last_name?: string;
  profile_image: string;
  is_admin?: boolean;
}

export interface GroupInfo {
  id: number;
  name: string;
  description: string; // Added
  members_count: number; // Renamed from total_members if needed, but keeping consistent with API doc
  cover_image: string;
  is_admin?: boolean; // New
  is_member?: boolean; // New
  can_join?: boolean; // New
  has_pending_request?: boolean; // New
  pending_requests_count?: number; // New
  last_message?: {
    // New based on API list response
    id: number;
    content: string;
    created_at: string;
    sender: {
      id: number;
      first_name: string;
      last_name?: string;
      profile_image: string;
    };
  };
  members?: GroupMember[];
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

// Pour la liste des demandes d'adhésion (Admin)
export interface JoinRequest {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string;
  };
  message: string;
  created_at: string;
}

// Pour la liste des groupes (compatibilité existante + API)
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
