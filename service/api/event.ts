import { apiClient } from "./client";

interface Creator {
  id: number;
  name: string;
  profile_image: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  location: string;
  distance: number;
  pace: string;
  level: "beginner" | "intermediate" | "advanced";
  status: string;
  latitude: number;
  longitude: number;
  participants_count: number;
  max_participants: number;
  spots_left: number;
  creator: Creator;
  is_creator: boolean;
  is_participant: boolean;
  can_join: boolean;
  can_leave: boolean;
}

interface EventsResponse {
  events: Event[];
  total: number;
  debug?: {
    total_events: number;
    upcoming_events: number;
    filtered_events: number;
  };
}

interface CreateEventData {
  name: string;
  description: string;
  start_date: string;
  location: string;
  distance: number;
  pace: string;
  level: "beginner" | "intermediate" | "advanced";
  max_participants: number;
}

class EventService {
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get("/events");
      return response.events || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      throw error; // Laisser le composant gérer l'erreur
    }
  }

  async joinEvent(eventId: number): Promise<Event> {
    try {
      const response = await apiClient.post(`/events/${eventId}/join`, {});
      return response;
    } catch (error: any) {
      const errorMessage =
        error.message || "Impossible de rejoindre l'événement";
      throw new Error(errorMessage);
    }
  }

  async leaveEvent(eventId: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.post(`/events/${eventId}/leave`, {});
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
      const errorMessage =
        error.message || "Erreur lors de la création de l'événement";
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
