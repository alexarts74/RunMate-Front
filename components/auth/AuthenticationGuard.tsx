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
      const inAuthGroup = segments[0] === "(auth)";
      const isIndex = segments.length === 0 || (segments[0] as string) === "";

      if (isAuthenticated) {
        console.log("État de l'authentification:", {
          inAuthGroup,
          isIndex,
          hasProfile: !!user?.runner_profile,
          currentSegment: segments[0],
        });

        if (inAuthGroup || isIndex) {
          if (user?.runner_profile) {
            router.replace("/(tabs)/matches");
          } else {
            router.replace("/(app)/runner/runner-profile");
          }
        }
      }
    }
  }, [isAuthenticated, segments, isLoading, user]);

  if (isLoading) {
    return null;
  }

  return children;
}
