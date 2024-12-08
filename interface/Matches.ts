export interface MatchFilters {
  filter_pace?: boolean;
  filter_distance?: boolean;
  filter_availability?: boolean;
  age_min?: number;
  age_max?: number;
  gender?: string;
  location?: string;
};

export interface MatchUser {
  user: {
    id: number;
    name: string;
    location: string;
    profile_image: string;
    bio?: string;
    runner_profile: {
      actual_pace: string;
      usual_distance: number;
      availability: string[];
      objective: string;
    };
  };
  score?: number;
  compatibility_details: {
    pace_match: number;
    distance_match: number;
    availability_match: number;
  };
};

export interface MatchResponse {
  matches: MatchUser[];
  total: number;
};

export type MatchesContextType = {
  matches: MatchUser[];
  setMatches: (matches: MatchUser[]) => void;
};
