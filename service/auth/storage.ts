import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = "@authToken";
const USER_KEY = "@userData";

export const authStorage = {
  async storeToken(token: string) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Erreur lors du stockage du token:", error);
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
      return null;
    }
  },

  async storeUser(userData: any) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Erreur lors du stockage des données utilisateur:", error);
    }
  },

  async getUser() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      return null;
    }
  },

  async removeAuth() {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      console.log("Toutes les clés de stockage supprimées");
    } catch (error) {
      console.error("Erreur lors de la suppression des données auth:", error);
    }
  },
};
