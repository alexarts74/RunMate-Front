import React, { createContext, useContext, useEffect, useState } from "react";
import { MatchUser } from "@/interface/Matches";
import { matchesService } from "@/service/api/matching";

type MatchesContextType = {
  matches: MatchUser[];
  setMatches: (matches: MatchUser[]) => void;
  refreshMatches: () => Promise<void>;
  isLoading: boolean;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<MatchUser[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const refreshMatches = async () => {
    try {
      setIsLoading(true);
      const matchesData = await matchesService.getMatches();
      console.log("Matches récupérés:", matchesData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des matches:", error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMatches();
  }, []);

  return (
    <MatchesContext.Provider
      value={{ matches, setMatches, refreshMatches, isLoading }}
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
