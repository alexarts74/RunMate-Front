import { API_CONFIG } from "@/config/api";
import { authStorage } from "../auth/storage";

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;
    this.timeout = 10000;

    console.log("🚀 ApiClient initialisé avec:", {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
    });
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
      const headers = await this.getHeaders();

      console.log("🌐 Requête API:", {
        url,
        method: options.method,
        headers: headers,
      });

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...headers,
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      console.log("📡 Réponse API:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        // Vérifier si la réponse est du HTML (erreur de serveur)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          const htmlText = await response.text();
          console.error("❌ Serveur retourne du HTML au lieu de JSON:", {
            status: response.status,
            contentType,
            htmlPreview: htmlText.substring(0, 200) + "...",
          });
          throw new Error(
            `Erreur serveur: Le serveur retourne du HTML (${response.status}). Vérifiez l'URL de l'API.`
          );
        }

        const data = await response.json();
        if (response.status === 401) {
          await authStorage.removeAuth();
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error("❌ Erreur fetchWithTimeout:", {
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
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
        console.error("Erreur HTTP:", response.status);
        console.error("Détails de l'erreur:", responseData);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return responseData;
    } catch (error) {
      console.error("Erreur dans apiClient.post:", error);
      throw error;
    }
  }

  async get(endpoint: string, config?: { headers?: any; params?: any }) {
    try {
      const defaultHeaders = await this.getHeaders();
      const headers = {
        ...defaultHeaders,
        ...(config?.headers || {}),
      };

      // Construire l'URL avec les query parameters
      let url = `${this.baseUrl}${endpoint}`;
      if (config?.params) {
        const queryParams = new URLSearchParams();

        // Debug log avant transformation
        Object.entries(config.params).forEach(([key, value]) => {
          if (value && typeof value === "object" && !Array.isArray(value)) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              const paramKey = `${key}[${subKey}]`;
              queryParams.append(paramKey, String(subValue));
            });
          } else {
            queryParams.append(key, String(value));
          }
        });

        url += `?${queryParams.toString()}`;
      }

      const response = await this.fetchWithTimeout(url, {
        method: "GET",
        headers,
      });

      const responseData = await response.json();

      if (!response.ok) {
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
      const headers = await this.getHeaders();
      const url = `${this.baseUrl}${endpoint}`;

      const response = await this.fetchWithTimeout(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

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
