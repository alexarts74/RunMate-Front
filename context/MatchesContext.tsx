import React, { createContext, useContext, useEffect, useState } from "react";
import { MatchFilters, MatchUser } from "@/interface/Matches";
import { matchesService } from "@/service/api/matching";

type MatchesContextType = {
  matches: MatchUser[];
  setMatches: (matches: MatchUser[]) => void;
  refreshMatches: () => Promise<void>;
  applyFilters: (filters: any) => Promise<void>;
  isLoading: boolean;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [currentFilters, setCurrentFilters] = useState<MatchFilters | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshMatches = async () => {
    try {
      setIsLoading(true);
      console.log("currentFilters", currentFilters);
      const matchesData = currentFilters
        ? await matchesService.applyFilters(currentFilters)
        : await matchesService.getMatches();
      setMatches(matchesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des matches:", error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = async (filters: MatchFilters) => {
    console.log("applyFilters", filters);
    try {
      setIsLoading(true);
      setCurrentFilters(filters);
      const filteredMatches = await matchesService.applyFilters(filters);
      setMatches(filteredMatches);
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };
;

  return (
    <MatchesContext.Provider
      value={{
        matches,
        setMatches,
        refreshMatches,
        applyFilters,
        isLoading
      }}
    >
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
