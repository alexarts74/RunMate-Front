import React, { createContext, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { authService } from "@/service/api/auth";
import { authStorage } from "@/service/auth/storage";
import User, { UserWithRunnerProfile } from "@/interface/User";
import { UserInfo } from "os";

type AuthContextType = {
  isAuthenticated: boolean;
  updateUser: (userData: User) => Promise<void>;
  user: UserWithRunnerProfile | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  signUp: (userData: User) => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUserSubscriptionPlan: (userData: User) => Promise<void>;
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
        await cleanStorage();
        return false;
      }
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

      await authStorage.storeToken(userData.authentication_token);
      console.log("Token:", userData.authentication_token);
      await authStorage.storeUser(userData.user);
      await authStorage.getToken();
      console.log("Token in storage:", await authStorage.getToken());

      setUser(userData.user);
      setIsAuthenticated(true);

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
      router.replace("/login");
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
      await authStorage.storeUser(response.user);
      await authStorage.storeToken(response.authentication_token);
      setUser(response.user);
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
      }
    } catch (error: any) {
      if (error?.status === 401) {
        await cleanStorage();
        router.replace("/login");
        return;
      }
      console.error("Erreur getUser:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      await cleanStorage();
      router.replace("/");
    } catch (error) {
      console.error("Erreur suppression compte:", error);
    }
  };

  const updateUserSubscriptionPlan = async (userData: User) => {
    try {
      const response = await authService.updateUserSubscriptionPlan(userData);
      await authStorage.storeUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error("Erreur dans updateUserProfile:", error);
      throw error;
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

  // Effet de nettoyage - vérifie la validité de l'utilisateur stocké et déconnecte si nécessaire
  // useEffect(() => {
  //   authStorage.removeAuth();
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        updateUser,
        logout,
        signUp,
        updateUserSubscriptionPlan,
        isLoading,
        deleteAccount,
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
