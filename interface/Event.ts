export interface Creator {
  id: number;
  name: string;
  profile_image: string;
}

export interface Participant {
  id: number;
  name: string;
  profile_image: string;
  is_creator: boolean;
}

export interface Event {
  id: string;
  name: string;
  cover_image: string;
  description: string;
  start_date: string;
  location: string;
  distance: number;
  level: "beginner" | "intermediate" | "advanced";
  status: string;
  latitude: number;
  longitude: number;
  participants: Participant[];
  participants_count: number;
  max_participants: number;
  spots_left: number;
  creator: Creator;
  is_creator: boolean;
  is_participant: boolean;
  can_join: boolean;
  can_leave: boolean;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  debug?: {
    total_events: number;
    upcoming_events: number;
    filtered_events: number;
  };
}

export interface CreateEventData {
  name: string;
  description: string;
  start_date: string;
  location: string;
  distance: number;
  level: "beginner" | "intermediate" | "advanced";
  max_participants: number;
}
