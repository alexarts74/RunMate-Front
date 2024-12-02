import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/service/api/auth";
import User from "@/interface/User";

type AuthContextType = {
  isAuthenticated: boolean;
  updateUser: (userData: any) => Promise<void>;
  user: User | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  signUp: (userData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      console.log("Données reçues au login:", userData);
      await AsyncStorage.setItem("authToken", userData.authentication_token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData.user));
      setUser(userData.user);
      setIsAuthenticated(true);
      console.log("User stocké:", userData.user);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      console.log("Données supprimées");
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/(auth)/login");
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
      console.log("Réponse de l'API dans updateUser:", response);

      if (response.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(response.user));
        setUser(response.user);
        console.log("State user mis à jour avec:", response.user);
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
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        console.log("Données récupérées:", JSON.parse(userData));
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      throw error;
    }
  };

  useEffect(() => {
    getUser();
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
