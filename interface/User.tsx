interface User {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  age: number | null;
  profile_image: string | null;
  last_name: string | null;
  level: string | null;
  authentication_token: string | null;
  created_at: string;
  updated_at: string;
}

export default User;
