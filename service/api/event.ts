import { CreateEventData, Event } from "@/interface/Event";
import { apiClient } from "./client";

class EventService {
  async getAllEvents(params?: { radius?: number }): Promise<Event[]> {
    try {
      const apiParams = params?.radius ? { distance: params.radius } : {};
      const response = await apiClient.get("/events", {
        params: { event: apiParams },
      });

      return response.events || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      throw error;
    }
  }

  async joinEvent(eventId: string): Promise<Event> {
    try {
      const response = await apiClient.post(`/events/${eventId}/join`, {});

      return response;
    } catch (error: any) {
      // Gestion plus précise des erreurs
      if (error.response?.status === 422) {
        const errorMessage =
          error.response?.data?.error ||
          "Impossible de rejoindre l'événement (vous participez peut-être déjà ou l'événement est complet)";
        throw new Error(errorMessage);
      }

      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Impossible de rejoindre l'événement";
      throw new Error(errorMessage);
    }
  }

  async leaveEvent(eventId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete(`/events/${eventId}/leave`);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || "Impossible de quitter l'événement";
      throw new Error(errorMessage);
    }
  }

  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const response = await apiClient.post("/events", { event: eventData });
      return response;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error(
          "Seuls les organisateurs peuvent créer des événements. Veuillez créer un compte organisateur pour accéder à cette fonctionnalité."
        );
      }
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la création de l'événement";
      throw new Error(errorMessage);
    }
  }

  async getMyEvents(): Promise<{ participating: Event[]; created: Event[] }> {
    try {
      const response = await apiClient.get("/events/my_events");
      return {
        participating: response.participating || [],
        created: response.created || [],
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de mes événements:", error);
      throw error;
    }
  }

  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'événement:", error);
      throw error;
    }
  }

  async getUpcomingEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get("/events/upcoming");
      return response.events || [];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des événements à venir:",
        error
      );
      throw error;
    }
  }
}

export const eventService = new EventService();
