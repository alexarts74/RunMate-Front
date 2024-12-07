import { MatchFilters, MatchUser } from "@/interface/Matches";
import { apiClient } from "./client";


export const matchesService = {

  getMatches: async (filters?: MatchFilters) => {
    console.log("Filters:", filters);
    try {
      const formattedFilters = filters
        ? Object.entries(filters).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: value.toString(),
            }),
            {}
          )
        : {};

      const url = `/matches${
        filters ? `?${new URLSearchParams(formattedFilters)}` : ""
      }`;
      console.log("Requête matches URL:", url);

      const response = await apiClient.get(url);
      console.log("Réponse matches brute:", response);

      if (!response || !response.matches) {
        console.error("Format de réponse invalide:", response);
        return [];
      }

      const matches = response.matches.map((match: MatchUser) => ({
        ...match,
        user: {
          ...match.user,
          runner_profile: match.user.runner_profile
        }
      }));

      console.log("Matches transformés:", matches);
      return matches;
    } catch (error) {
      console.error("Erreur getMatches:", error);
      return [];
    }
  },

  async applyFilters(filters: MatchFilters) {
    return await apiClient.post("/matches/apply_filters", { filters });
  }
};
