import { useEffect, useState } from 'react';
import { authStorage } from '@/service/auth/storage';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '../LoadingScreen';
import React from 'react';
import { Slot, useSegments, useRouter } from 'expo-router';

export default function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { login, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoading) {
      if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)/Homepage');
      } else if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  const checkAuth = async () => {
    try {
      console.log("1. Vérification de l'auth au démarrage");
      const token = await authStorage.getToken();
      console.log("2. Token récupéré:", token ? "Présent" : "Absent");

      const userData = await authStorage.getUser();
      console.log("3. userData récupéré:", userData);

      if (token && userData) {
        console.log("4. Tentative de restauration de session");
        await login(userData);
        console.log("5. Session restaurée avec succès");
      } else {
        console.log("❌ Pas de données d'auth trouvées");
      }
    } catch (error) {
      console.error("❌ Erreur checkAuth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return children;
}
