interface User {
  id: number;
  email: string;
  name: string | null;
  last_name: string | null;
  bio: string | null;
  age: number | null;
  gender: string | null;
  location: string | null;
  profile_image: string | null;
  level: string | null;
  authentication_token: string | null;
  created_at: string;
  updated_at: string;
}

export default User;
