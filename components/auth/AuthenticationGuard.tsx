import { useEffect, useState } from 'react';
import { authStorage } from '@/service/auth/storage';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { useSegments, useRouter } from 'expo-router';

export default function AuthenticationGuard({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { login, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
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
        console.error("❌ Erreur init:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      const isIndex = segments.length === 0 || (segments[0] as string) === '';

      if (isAuthenticated) {
        setTimeout(() => {
          if (inAuthGroup || isIndex) {
            router.replace('/(tabs)/Homepage');
          }
        }, 100);
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return null;
  }

  return children;
}
