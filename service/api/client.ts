import { API_CONFIG } from "@/config/api";
import { authStorage } from "../auth/storage";

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;
    this.timeout = 10000;
  }

  private async getHeaders() {
    const token = await authStorage.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async fetchWithTimeout(url: string, options: RequestInit) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log("Fetching with timeout:", url);
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

  async get(endpoint: string, config?: { headers?: any }) {
    try {
      const defaultHeaders = await this.getHeaders();
      const headers = {
        ...defaultHeaders,
        ...(config?.headers || {}),
      };

      const url = `${this.baseUrl}${endpoint}`;

      const response = await this.fetchWithTimeout(url, {
        method: "GET",
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Réponse non OK:", {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        });
        throw new Error(
          responseData.message || `Erreur HTTP: ${response.status}`
        );
      }

      return responseData;
    } catch (error: any) {
      console.error("Erreur détaillée dans GET:", {
        endpoint,
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
      throw error;
    }
  }

  async put(endpoint: string, data: any) {
    try {
      const token = await authStorage.getToken();
      console.log("Token disponible:", !!token);

      const headers = await this.getHeaders();
      console.log("Headers de la requête:", headers);

      const url = `${this.baseUrl}${endpoint}`;
      console.log("URL de la requête:", url);
      console.log("Données envoyées:", data);

      const response = await this.fetchWithTimeout(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      console.log("Status de la réponse:", response.status);
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      if (!response.ok) {
        console.error("Erreur HTTP:", response.status);
        console.error("Message d'erreur:", responseText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = responseText ? JSON.parse(responseText) : {};
      return responseData;
    } catch (error) {
      console.error("Erreur détaillée dans PUT:", {
        message: error instanceof Error ? error.message : "Erreur inconnue",
        error,
      });
      throw error;
    }
  }

  async delete(endpoint: string) {
    const headers = await this.getHeaders();
    const url = `${this.baseUrl}${endpoint}`;
    const response = await this.fetchWithTimeout(url, {
      headers,
      method: "DELETE",
    });
    return await response.json();
  }
}

export const apiClient = new ApiClient();
