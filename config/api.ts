import Constants from "expo-constants";
import { Platform } from "react-native";

// Fonction pour obtenir l'IP locale depuis le hostUri d'Expo
const getLocalIP = (): string | null => {
  try {
    // Expo fournit l'IP du serveur de développement dans hostUri
    // Format: "192.168.1.100:8081" ou "localhost:8081"
    // On essaie plusieurs sources pour plus de compatibilité
    const hostUri = 
      Constants.expoConfig?.hostUri || 
      Constants.manifest?.hostUri ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost;
    
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      // Si c'est localhost, on retourne null pour utiliser la config par défaut
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  } catch (error) {
    console.warn("⚠️ Impossible de détecter l'IP locale:", error);
  }
  return null;
};

// URL par défaut pour le développement local
const DEFAULT_API_URL = "http://localhost:3000";

// Détecter l'IP locale automatiquement sur mobile
const getApiBaseUrl = (): string => {
  // 1. Vérifier si une URL est définie dans la config Expo
  const configUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  if (configUrl && configUrl !== DEFAULT_API_URL) {
    return configUrl;
  }

  // 2. Sur mobile, essayer de détecter l'IP locale automatiquement
  if (Platform.OS !== 'web') {
    const localIP = getLocalIP();
    if (localIP) {
      return `http://${localIP}:3000`;
    }
  }

  // 3. Fallback sur localhost (fonctionne sur simulateur/émulateur)
  return DEFAULT_API_URL;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  API_VERSION: "/api",
};

// Log pour debug
console.log("🔧 API Config chargée:", {
  "Platform": Platform.OS,
  "hostUri": Constants.expoConfig?.hostUri,
  "apiBaseUrl from env": Constants.expoConfig?.extra?.apiBaseUrl,
  "DEFAULT_API_URL": DEFAULT_API_URL,
  "BASE_URL final": API_CONFIG.BASE_URL,
});
