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
}

export interface UserWithRunnerProfile extends User {
  runner_profile: RunnerProfile;
}

export interface RunnerProfile {
  actual_pace: string;
  usual_distance: string;
  availability: string[];
  objective: string;
}

export default User;
