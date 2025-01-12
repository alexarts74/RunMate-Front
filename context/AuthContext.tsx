import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { authService } from "@/service/api/auth";
import { authStorage } from "@/service/auth/storage";
import { UserWithRunnerProfile } from "@/interface/User";

type AuthContextType = {
  isAuthenticated: boolean;
  updateUser: (userData: any) => Promise<void>;
  user: UserWithRunnerProfile | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  signUp: (userData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserWithRunnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = async () => {
    try {
      const token = await authStorage.getToken();
      const user = await authStorage.getUser();

      if (!token || !user) {
        console.log("❌ Pas de token ou user dans le storage");
        await cleanStorage();
        return false;
      }

      console.log("✅ Token et user trouvés dans le storage");
      return true;
    } catch (error) {
      console.error("Erreur checkAuth:", error);
      return false;
    }
  };

  const cleanStorage = async () => {
    try {
      await authStorage.removeAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erreur lors du nettoyage du storage:", error);
    }
  };

  const signUp = async (userData: any) => {
    try {
      setIsLoading(true);
      await authService.signUp(userData);
    } catch (error) {
      console.error("Erreur lors de la création de compte:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: any) => {
    try {
      setIsLoading(true);

      if (!userData.authentication_token) {
        throw new Error("Token manquant");
      }

      // D'abord stocker le token et les données utilisateur initiales
      await authStorage.storeToken(userData.authentication_token);
      await authStorage.storeUser(userData.user);

      // Vérifier le stockage
      await authStorage.getToken();

      // Mettre à jour l'état avec les données initiales
      setUser(userData.user);
      setIsAuthenticated(true);

      // Ensuite seulement essayer d'obtenir les données complètes
      try {
        const completeUserData = await authService.getCurrentUser();

        if (completeUserData) {
          await authStorage.storeUser(completeUserData);
          setUser(completeUserData);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données complètes:",
          error
        );
        // Ne pas throw l'erreur ici, continuer avec les données de base
      }
    } catch (error) {
      console.error("❌ Erreur login:", error);
      await cleanStorage();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      await authStorage.removeAuth();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await authService.updateUserProfile(userData);

      // Utiliser directement userData qui contient déjà le runner_profile
      await authStorage.storeUser(userData);
      setUser(userData);

      // Vérifier ce qui est stocké
      await authStorage.getUser();

      return response;
    } catch (error) {
      console.error("Erreur dans updateUser:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const token = await authStorage.getToken();
      if (!token) {
        console.log("❌ Pas de token pour getUser");
        return;
      }

      const storedUser = await authStorage.getUser();
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }

      // Mise à jour avec l'API
      const freshUserData = await authService.getCurrentUser();
      if (freshUserData) {
        await authStorage.storeUser(freshUserData);
        setUser(freshUserData);
        setIsAuthenticated(true);
        console.log("✅ Données utilisateur mises à jour depuis l'API");
      }
    } catch (error: any) {
      if (error?.status === 401) {
        console.log("❌ Token expiré ou invalide");
        await cleanStorage();
        router.replace("/login");
        return;
      }
      console.error("Erreur getUser:", error);
    }
  };

  // Initialisation de l'auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isAuth = await checkAuth();
        if (isAuth) {
          await getUser();
        }
      } catch (error) {
        console.error("Erreur initAuth:", error);
        await cleanStorage();
        router.replace("/login");
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        signUp,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
