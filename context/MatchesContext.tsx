import React, { createContext, useContext, useEffect, useState } from "react";
import { MatchFilters, MatchUser } from "@/interface/Matches";
import { matchesService } from "@/service/api/matching";
import { useAuth } from "./AuthContext";

type MatchesContextType = {
  matches: MatchUser[];
  setMatches: (matches: MatchUser[]) => void;
  refreshMatches: () => Promise<void>;
  applyFilters: (filters: MatchFilters) => Promise<void>;
  isLoading: boolean;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [currentFilters, setCurrentFilters] = useState<MatchFilters | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const refreshMatches = async () => {
    try {
      if (!isAuthenticated) {
        setMatches([]);
        return;
      }

      if (!user?.runner_profile) {
        setMatches([]);
        return;
      }

      setIsLoading(true);

      // Ajout d'un délai artificiel de 2 secondes pour tester le loading screen
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
    try {
      setIsLoading(true);

      // Ajout d'un délai artificiel de 2 secondes pour tester le loading screen
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

  // Rafraîchir les matches quand l'authentification ou le profil runner change
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!user) {
      console.error("En attente des données utilisateur...");
      return;
    }

    if (!user.runner_profile) {
      setMatches([]);
      return;
    }

    refreshMatches();
  }, [isAuthenticated, user?.runner_profile]);

  return (
    <MatchesContext.Provider
      value={{
        matches,
        setMatches: (newMatches: MatchUser[]) => {
          setMatches(newMatches);
        },
        refreshMatches,
        applyFilters,
        isLoading,
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
