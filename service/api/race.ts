import { Race, RacesResponse, RacesQueryParams } from "@/interface/Race";
import { apiClient } from "./client";

class RaceService {
  async getAllRaces(params?: RacesQueryParams): Promise<RacesResponse> {
    try {
      const response = await apiClient.get("/races", {
        params: params || {},
      });

      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération des courses:", error);
      throw error;
    }
  }

  async getRaceById(raceId: number): Promise<Race> {
    try {
      const response = await apiClient.get(`/races/${raceId}`);
      return response;
    } catch (error) {
      console.error("Erreur lors de la récupération de la course:", error);
      throw error;
    }
  }
}

export const raceService = new RaceService();

