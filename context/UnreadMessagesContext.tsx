import React, { createContext, useContext, useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { directMessageService } from "@/service/api/message";

type UnreadMessagesContextType = {
  unreadCount: number;
  lastMessages: { [key: string]: any };
  decrementUnreadCount: (amount: number) => void;
  refreshUnreadCount: () => Promise<void>;
  updateLastMessage: (userId: string, message: any) => void;
};

const UnreadMessagesContext = createContext<
  UnreadMessagesContextType | undefined
>(undefined);

export function UnreadMessagesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessages, setLastMessages] = useState<{ [key: string]: any }>({});
  const { isAuthenticated, user } = useAuth();

  const updateLastMessage = (userId: string, message: any) => {
    setLastMessages((prev) => ({
      ...prev,
      [userId]: message,
    }));
  };

  const refreshUnreadCount = async () => {
    try {
      if (!user?.runner_profile) {
        setUnreadCount(0);
        return;
      }

      const conversations = await directMessageService.getAllConversations();
      const totalUnread = conversations.reduce(
        (sum: number, conv: any) => sum + conv.unread_messages,
        0
      );
      setUnreadCount(totalUnread);

      // Mettre à jour les derniers messages
      const messagesMap = conversations.reduce(
        (acc: { [key: string]: any }, conv: any) => ({
          ...acc,
          [conv.user.id]: conv.last_message,
        }),
        {}
      );
      setLastMessages(messagesMap);
    } catch (error) {
      console.error("Erreur chargement messages non lus:", error);
      setUnreadCount(0);
    }
  };

  const decrementUnreadCount = (amount: number) => {
    setUnreadCount((prev) => Math.max(0, prev - amount));
  };

  useEffect(() => {
    if (isAuthenticated && user?.runner_profile) {
      refreshUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?.runner_profile]);

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCount,
        lastMessages,
        decrementUnreadCount,
        refreshUnreadCount,
        updateLastMessage,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error(
      "useUnreadMessages doit être utilisé dans un UnreadMessagesProvider"
    );
  }
  return context;
};
