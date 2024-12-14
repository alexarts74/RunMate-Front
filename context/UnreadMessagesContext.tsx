import React, { createContext, useContext, useState, useEffect } from "react";
import messageService from "@/service/api/message";
import { useAuth } from "@/context/AuthContext";

type UnreadMessagesContextType = {
  unreadCount: number;
  decrementUnreadCount: (amount: number) => void;
  refreshUnreadCount: () => Promise<void>;
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
  const { isAuthenticated, user } = useAuth();

  const refreshUnreadCount = async () => {
    try {
      if (!user?.runner_profile) {
        setUnreadCount(0);
        return;
      }

      const conversations = await messageService.getAllConversations();
      const totalUnread = conversations.reduce(
        (sum, conv) => sum + conv.unread_messages,
        0
      );
      setUnreadCount(totalUnread);
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
        decrementUnreadCount,
        refreshUnreadCount,
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
