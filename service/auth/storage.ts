import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@authToken";
const USER_KEY = "@userData";

export const authStorage = {
  async storeToken(token: string) {
    try {
      if (!token) {
        return;
      }
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Erreur lors du stockage du token:", error);
      throw error;
    }
  },

  async getToken() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
      return null;
    }
  },

  async storeUser(userData: any) {
    try {
      if (!userData) {
        return;
      }
      const userDataString = JSON.stringify(userData);
      await AsyncStorage.setItem(USER_KEY, userDataString);
    } catch (error) {
      console.error("Erreur lors du stockage des données utilisateur:", error);
      throw error;
    }
  },

  async getUser() {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (!userData) {
        return null;
      }
      return JSON.parse(userData);
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
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression des données auth:", error);
      throw error;
    }
  },

  // Pour le debug uniquement
  async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error("Erreur lors de la lecture des clés:", error);
    }
  },
};

export const signUpStorage = {
  async saveSignUpStep(step: number) {
    try {
      await AsyncStorage.setItem("@signup_step", step.toString());
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'étape:", error);
    }
  },

  async getSignUpStep(): Promise<number> {
    try {
      const step = await AsyncStorage.getItem("@signup_step");
      return step ? parseInt(step) : 1;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'étape:", error);
      return 1;
    }
  },

  async saveSignUpData(data: any) {
    try {
      await AsyncStorage.setItem("@signup_data", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
    }
  },

  async getSignUpData() {
    try {
      const data = await AsyncStorage.getItem("@signup_data");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      return null;
    }
  },

  async clearSignUpData() {
    try {
      await AsyncStorage.multiRemove(["@signup_step", "@signup_data"]);
    } catch (error) {
      console.error("Erreur lors du nettoyage des données:", error);
    }
  },
};
