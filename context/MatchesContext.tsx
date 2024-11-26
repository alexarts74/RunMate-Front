import React, { createContext, useContext, useState } from "react";

type MatchUser = {
  user: {
    id: number;
    name: string;
    location: string;
    profile_image: string;
    runner_profile: {
      actual_pace: string;
      usual_distance: number;
      availability: string[];
      objective: string;
    };
  };
  compatibility_details: {
    pace_match: number;
    distance_match: number;
    availability_match: number;
  };
  percentage: number;
};

type MatchesContextType = {
  matches: MatchUser[];
  setMatches: (matches: MatchUser[]) => void;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<MatchUser[]>([]);

  return (
    <MatchesContext.Provider value={{ matches, setMatches }}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const context = useContext(MatchesContext);
  if (context === undefined) {
    throw new Error(
      "useMatches doit être utilisé à l'intérieur d'un MatchesProvider"
    );
  }
  return context;
}
