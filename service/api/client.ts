import { API_CONFIG } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;
    this.timeout = 20000; // 10 secondes de timeout
  }

  private async getHeaders() {
    const token = await AsyncStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async fetchWithTimeout(url: string, options: RequestInit) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!response) {
        throw new Error("Pas de réponse du serveur");
      }

      return response;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error(`Timeout - L'API n'a pas répondu à ${url}`);
        throw new Error(
          `La requête a expiré après ${this.timeout / 1000} secondes`
        );
      }
      throw error;
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const headers = await this.getHeaders();
      const url = `${this.baseUrl}${endpoint}`;
      const response = await this.fetchWithTimeout(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Une erreur est survenue");
      }

      return responseData;
    } catch (error: any) {
      console.error("Erreur détaillée:", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async get(endpoint: string) {
    const headers = await this.getHeaders();
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, { headers });
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Une erreur est survenue");
    }

    return responseData;
  }

  async put(endpoint: string, data: any) {
    const headers = await this.getHeaders();
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Erreur HTTP:", response.status);
        console.error("Message d'erreur:", await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Erreur détaillée dans PUT:", error);
      throw error;
    }
  }

  async delete(endpoint: string) {
    const headers = await this.getHeaders();
    console.log("Headers:", headers);
    const url = `${this.baseUrl}${endpoint}`;
    console.log("URL:", url);
    const response = await this.fetchWithTimeout(url, {
      headers,
      method: "DELETE",
    });
    console.log("Réponse du DELETE request:", response);
    return await response.json();
  }
}

export const apiClient = new ApiClient();
