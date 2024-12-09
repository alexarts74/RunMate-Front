import React, { createContext, useContext, useState, useEffect } from 'react';
import messageService from '@/service/api/message';
import { useAuth } from '@/context/AuthContext';

type UnreadMessagesContextType = {
  unreadCount: number;
  decrementUnreadCount: (amount: number) => void;
  refreshUnreadCount: () => Promise<void>;
};

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const refreshUnreadCount = async () => {
    try {
      const conversations = await messageService.getAllConversations();
      const totalUnread = conversations.reduce(
        (sum, conv) => sum + conv.unread_messages,
        0
      );
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Erreur chargement messages non lus:", error);
    }
  };

  const decrementUnreadCount = (amount: number) => {
    setUnreadCount(prev => Math.max(0, prev - amount));
  };

  // Chargement initial quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      refreshUnreadCount();
    } else {
      setUnreadCount(0);  // Réinitialiser si déconnecté
    }
  }, [isAuthenticated]);  // Se déclenche à chaque changement d'authentification

  return (
    <UnreadMessagesContext.Provider value={{
      unreadCount,
      decrementUnreadCount,
      refreshUnreadCount
    }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error('useUnreadMessages doit être utilisé dans un UnreadMessagesProvider');
  }
  return context;
};
