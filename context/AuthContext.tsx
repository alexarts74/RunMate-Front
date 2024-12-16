import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/service/api/auth";
import { authStorage } from "@/service/auth/storage";
import User, { UserWithRunnerProfile } from "@/interface/User";

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
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
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
    console.log("DANS LE CONTEXT DANS LE LOGIN");
    try {
      setIsLoading(true);

      if (!userData.authentication_token) {
        throw new Error("Token manquant");
      }

      // D'abord stocker le token et les données utilisateur initiales
      await authStorage.storeToken(userData.authentication_token);
      await authStorage.storeUser(userData.user);

      // Vérifier le stockage
      const storedToken = await authStorage.getToken();
      console.log("Token stocké:", storedToken);

      // Mettre à jour l'état avec les données initiales
      setUser(userData.user);
      setIsAuthenticated(true);

      // Ensuite seulement essayer d'obtenir les données complètes
      try {
        const completeUserData = await authService.getCurrentUser();
        console.log("Données complètes reçues:", completeUserData);

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
      console.log("userData à stocker:", userData); // Debug
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);

      // Vérifier ce qui est stocké
      const storedData = await AsyncStorage.getItem("userData");
      console.log(
        "Données stockées dans AsyncStorage:",
        JSON.parse(storedData || "{}")
      ); // Debug

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
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("userData");

      if (!token || !userData) {
        await cleanStorage();
        router.replace("/");
        return;
      }

      // 1. D'abord, on set les données du storage pour une réponse rapide
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
      setIsAuthenticated(true);

      // 2. Ensuite, on fait un appel API pour avoir les données à jour
      try {
        const freshUserData = await authService.getCurrentUser();
        console.log("freshUserData", freshUserData);
        console.log(
          "freshUserData runner profile",
          freshUserData?.runner_profile
        );
        if (freshUserData) {
          await AsyncStorage.setItem("userData", JSON.stringify(freshUserData));
          setUser(freshUserData);
        }
      } catch (apiError) {
        console.error(
          "Erreur lors de la récupération des données fraîches:",
          apiError
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      await cleanStorage();
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
