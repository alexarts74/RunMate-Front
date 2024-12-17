import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      const userData = await authStorage.getUser();

      // Si aucune donnée n'est présente
      if (!token || !userData) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // 1. Set les données du storage
      setUser(userData); // userData est déjà parsé par authStorage.getUser()
      setIsAuthenticated(true);

      // 2. Mise à jour avec l'API
      try {
        const freshUserData = await authService.getCurrentUser();
        if (freshUserData) {
          await authStorage.storeUser(freshUserData);
          setUser(freshUserData);
        }
      } catch (apiError) {
        console.error(
          "Erreur lors de la récupération des données fraîches:",
          apiError
        );
        // On garde les données du storage si l'API échoue
      }
    } catch (error) {
      console.error("Erreur dans getUser:", error);
      await authStorage.removeAuth(); // Nettoyer proprement
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  /// si jamais je veux nettoyer le storage au démarrage

  // useEffect(() => {
  //   const initAuth = async () => {
  //     try {
  //       // Force le nettoyage du storage au démarrage
  //       await cleanStorage();
  //       console.log("Storage nettoyé au démarrage");

  //       // Redirige vers la page de login
  //       router.replace("/(auth)/login");
  //     } catch (error) {
  //       console.error("Erreur lors de l'initialisation:", error);
  //     }
  //   };

  //   initAuth();
  // }, []);

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
