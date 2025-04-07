interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  age: number | null;
  gender: string | null;
  city: string | null;
  department: string | null;
  profile_image: string | null;
  level: string | null;
  authentication_token: string | null;
  created_at: string;
  updated_at: string;
  location: string | null;
  is_premium: boolean;
}

export interface UserWithRunnerProfile extends User {
  runner_profile: RunnerProfile;
}

export interface RunnerProfile {
  actual_pace: string;
  usual_distance: string | null;
  availability: string[];
  objective: string;
  running_type: string;
  target_pace: string;
  weekly_mileage: number | null;
  competition_goals: string[];
  training_days: string[];
  social_preferences: string[];
  post_run_activities: string[];
  running_frequency: string[];
  preferred_time_of_day: string[];
}

export default User;
