export interface Race {
  id: number;
  name: string;
  description: string | null;
  location: string;
  start_date: string; // Format: YYYY-MM-DD
  distance?: number | null; // Distance en kilomètres (déprécié, utiliser distances)
  distances: number[]; // Tableau des distances disponibles en kilomètres
  cover_image: string | null;
  url: string | null;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface RacesResponse {
  races: Race[];
  total: number;
  page?: number;
  per_page?: number;
}

export interface RacesQueryParams {
  start_date?: string; // Format: YYYY-MM-DD
  end_date?: string; // Format: YYYY-MM-DD
  location?: string;
  source?: string;
  page?: number;
  per_page?: number;
}

