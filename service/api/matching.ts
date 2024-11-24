import { apiClient } from "./client";

type MatchFilters = {
  filter_pace?: boolean;
  filter_distance?: boolean;
  filter_availability?: boolean;
};

export type MatchUser = {
  user: {
    id: number;
    name: string;
    location: string;
    profile_image: string;
    bio: string;
    runner_profile: {
      actual_pace: string;
      usual_distance: number;
      availability: string[];
      objective: string;
    };
  };
  score: number;
  compatibility_details: {
    pace_match: number;
    distance_match: number;
    availability_match: number;
  };
};

type MatchResponse = {
  matches: MatchUser[];
  total: number;
};

export const matchesService = {
  getMatches: async (filters?: MatchFilters) => {
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
        throw new Error("Format de réponse invalide");
      }

      const parsedMatches = response.matches.map((match: MatchUser) => {
        try {
          return {
            ...match,
            user: {
              ...match.user,
              runner_profile: {
                ...match.user.runner_profile,
                availability:
                  typeof match.user.runner_profile.availability === "string"
                    ? JSON.parse(match.user.runner_profile.availability)
                    : match.user.runner_profile.availability,
              },
            },
          };
        } catch (e) {
          console.error("Erreur parsing match:", e);
          return match;
        }
      });

      console.log("Matches parsés:", parsedMatches);
      return parsedMatches;
    } catch (error) {
      console.error("Erreur getMatches:", error);
      throw error;
    }
  },
};
