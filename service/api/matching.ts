import { MatchFilters, MatchUser } from "@/interface/Matches";
import { apiClient } from "./client";

export const matchesService = {
  async getMatches() {
    try {
      const response = await apiClient.get('/matches');

      if (!response || !response.matches) {
        return [];
      }

      return response.matches.map((match: MatchUser) => ({
        ...match,
        user: {
          ...match.user,
          runner_profile: match.user.runner_profile
        }
      }));
    } catch (error) {
      console.error("Erreur getMatches:", error);
      return [];
    }
  },

  async applyFilters(filters: MatchFilters) {
    try {
      const response = await apiClient.post("/matches/apply_filters", { filters });

      if (!response || !response.matches) {
        return [];
      }

      return response.matches.map((match: MatchUser) => ({
        ...match,
        user: {
          ...match.user,
          runner_profile: match.user.runner_profile
        }
      }));
    } catch (error) {
      console.error("Erreur applyFilters:", error);
      return [];
    }
  }
};
