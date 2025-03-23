import { useEffect, useState } from "react";
import { authStorage } from "@/service/auth/storage";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { useSegments, useRouter } from "expo-router";

export default function AuthenticationGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { login, isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const token = await authStorage.getToken();
        const userData = await authStorage.getUser();

        if (token && userData) {
          await login(userData);
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
      const inAuthGroup = segments.length > 0 && segments[0] === "(auth)";
      const isRoot = segments.length === 0;

      if (isAuthenticated) {
        if (inAuthGroup || isRoot) {
          setTimeout(() => {
            router.replace("/(tabs)/matches");
          }, 100);
        }
      } else {
        if (!inAuthGroup && !isRoot) {
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 100);
        }
      }
    }
  }, [isAuthenticated, segments, isLoading, user]);

  if (isLoading) {
    console.log("AuthenticationGuard est en chargement...");
    return null;
  }

  return children;
}
