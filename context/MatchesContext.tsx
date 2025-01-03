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
        console.log("Utilisateur non authentifié, skip refreshMatches");
        setMatches([]);
        return;
      }

      if (!user?.runner_profile) {
        console.log("Pas de profil runner, skip refreshMatches");
        setMatches([]);
        return;
      }

      setIsLoading(true);
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
      console.log("🔍 Filtres appliqués:", filters);
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

  // Rafraîchir les matches quand l'authentification ou le profil runner change
  useEffect(() => {
    if (!isAuthenticated) {
      console.error("Utilisateur non authentifié, skip useEffect");
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
