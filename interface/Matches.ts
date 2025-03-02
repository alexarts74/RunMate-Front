export interface MatchFilters {
  filter_pace?: boolean;
  filter_distance?: boolean;
  filter_availability?: boolean;
  age_min?: number;
  age_max?: number;
  gender?: string;
  location?: string;
}

export interface MatchUser {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    city: string;
    department: string;
    profile_image: string;
    bio?: string;
    age: number;
    expo_push_token?: string;
    runner_profile: {
      actual_pace: string;
      usual_distance: number;
      availability: string[];
      objective: string;
      running_type: string;
      social_preferences?: string[];
      running_frequency?: string;
      target_pace?: string;
      weekly_mileage?: string;
      training_days?: string[];
      competition_goals?: string;
      post_run_activities?: string[];
      preferred_time_of_day?: string[];
    };
  };
  score?: number;
  distance_km?: number;
  compatibility_details: {
    pace_match: number;
    distance_match: number;
    availability_match: number;
  };
}

export interface MatchResponse {
  matches: MatchUser[];
  total: number;
}

export type MatchesContextType = {
  matches: MatchUser[];
  setMatches: (matches: MatchUser[]) => void;
};
