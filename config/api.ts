import Constants from "expo-constants";

// URL par défaut pour le développement local
const DEFAULT_API_URL = "http://localhost:3000";

export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || DEFAULT_API_URL,
  API_VERSION: "/api",
};
