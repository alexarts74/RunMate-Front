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
    try {
      setIsLoading(true);

      if (!userData.authentication_token) {
        throw new Error("Token manquant");
      }

      const userToStore = userData.user || userData;
      const tokenToStore = userData.authentication_token;

      await AsyncStorage.setItem("authToken", tokenToStore);
      await AsyncStorage.setItem("userData", JSON.stringify(userToStore));

      await authStorage.storeToken(tokenToStore);
      await authStorage.storeUser(userToStore);

      setUser(userToStore);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Erreur login:", error);
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
      if (response.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));
        setUser(response.user);
      }
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

      const parsedData = JSON.parse(userData);
      setUser(parsedData);
      setIsAuthenticated(true);
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
