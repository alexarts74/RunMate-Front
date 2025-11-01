import Constants from "expo-constants";

// URL par défaut pour le développement local
// Note: localhost ne fonctionne pas sur téléphone physique
// L'IP locale sera détectée automatiquement par app.config.js ou .env
const DEFAULT_API_URL = "http://localhost:3000";

export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl || DEFAULT_API_URL,
  API_VERSION: "/api",
};

// Log pour debug
console.log("🔧 API Config chargée:", {
  "apiBaseUrl from env": Constants.expoConfig?.extra?.apiBaseUrl,
  "DEFAULT_API_URL": DEFAULT_API_URL,
  "BASE_URL final": API_CONFIG.BASE_URL,
});
