import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { PaceDistanceInputs } from "@/components/runner-profile/PaceDistanceInputs";
import { ObjectiveSelect } from "@/components/runnner-profile/ObjectiveSelect";
import { AvailabilitySelect } from "@/components/runner-profile/AvailabilitySelect";
import { ActionButtons } from "@/components/runner-profile/ActionButtons";
import { runnerProfileService } from "@/service/api/runnerProfile";
import { matchesService } from "@/service/api/matching";
import { useMatches } from "@/context/MatchesContext";

export default function RunnerProfileScreen() {
  const [formData, setFormData] = useState({
    actual_pace: "",
    usual_distance: "",
    availability: [] as string[],
    objective: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setMatches } = useMatches();

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      // 1. Sauvegarder le profil
      console.log("Données du formulaire:", formData);
      await runnerProfileService.save(formData);

      // 2. Récupérer les matches
      console.log("Récupération des matches...");
      const matchesData = await matchesService.getMatches({
        filter_pace: true,
        filter_distance: true,
        filter_availability: true,
      });

      console.log("Matches récupérés:", matchesData);

      // 3. Stocker les matches dans le context
      setMatches(matchesData);

      // 4. Rediriger vers la homepage
      router.replace("/(tabs)/Homepage");
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 mt-12 bg-dark px-5 py-6">
      <Text className="text-2xl font-bold mb-6 text-center text-white">
        Votre profil de coureur
      </Text>

      <PaceDistanceInputs
        actual_pace={formData.actual_pace}
        usual_distance={formData.usual_distance}
        handleChange={handleChange}
      />

      <ObjectiveSelect handleChange={handleChange} />

      <AvailabilitySelect
        availability={formData.availability}
        handleChange={handleChange}
      />

      {error ? (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      ) : null}

      <ActionButtons loading={loading} handleSubmit={handleSubmit} />
    </ScrollView>
  );
}
