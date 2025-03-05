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

export enum EventLevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  ADVANCED = 2,
  EXPERT = 3,
}

export enum EventStatus {
  PENDING = 0,
  ACTIVE = 1,
  CANCELLED = 2,
  COMPLETED = 3,
}

export interface Event extends CreateEventData, EventsResponse {
  id: string;
  creator_id: number;
  created_at: string;
  updated_at: string;
  participants: Participant[];
  participants_count: number;
  spots_left: number;
  creator: Creator;
  is_creator: boolean;
  is_participant: boolean;
  can_join: boolean;
  can_leave: boolean;
  start_time: string;
  end_time: string;
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
  start_date: string | Date;
  start_time: string;
  end_time: string;
  location: string;
  distance: number;
  level: EventLevel;
  max_participants: number;
  cover_image: string;
  latitude: number | null;
  longitude: number | null;
  status?: EventStatus; // Optionnel car généralement défini par défaut côté serveur
  invited_users: number[];
}
