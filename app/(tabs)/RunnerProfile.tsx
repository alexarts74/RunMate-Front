import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import { runnerProfileService } from "@/service/api/runnerProfile";

export default function RunnerProfileScreen() {
  const [formData, setFormData] = useState({
    actual_pace: "",
    usual_distance: "",
    availability: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const levelOptions = [
    { key: "beginner", value: "Débutant" },
    { key: "intermediate", value: "Intermédiaire" },
    { key: "advanced", value: "Avancé" },
  ];

  const availabilityOptions = [
    { key: "monday", value: "Lundi" },
    { key: "tuesday", value: "Mardi" },
    { key: "wednesday", value: "Mercredi" },
    { key: "thursday", value: "Jeudi" },
    { key: "friday", value: "Vendredi" },
    { key: "saturday", value: "Samedi" },
    { key: "sunday", value: "Dimanche" },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      await runnerProfileService.save(formData);
      router.replace("/(tabs)/Homepage");
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError("Erreur lors de la sauvegarde du profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 mt-12 bg-dark px-5 py-6">
      <Text className="text-2xl font-bold mb-6 text-center text-white">
        Votre profil de coureur
      </Text>

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Allure actuelle (min/km)"
        placeholderTextColor="#9CA3AF"
        value={formData.actual_pace}
        onChangeText={(value) => handleChange("actual_pace", value)}
        keyboardType="numeric"
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Distance habituelle (km)"
        placeholderTextColor="#9CA3AF"
        value={formData.usual_distance}
        onChangeText={(value) => handleChange("usual_distance", value)}
        keyboardType="numeric"
      />

      <SelectList
        setSelected={(val: string) => handleChange("level", val)}
        data={levelOptions}
        save="key"
        placeholder="Sélectionnez votre niveau"
        boxStyles={{
          borderWidth: 1,
          borderColor: "#374151",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          backgroundColor: "#111827",
        }}
        dropdownStyles={{
          borderWidth: 1,
          borderColor: "#374151",
          borderRadius: 8,
          backgroundColor: "#111827",
        }}
        inputStyles={{ color: "#fff" }}
        dropdownTextStyles={{ color: "#fff" }}
        search={false}
      />

      <SelectList
        setSelected={(val: string) => handleChange("availability", val)}
        data={availabilityOptions}
        save="key"
        placeholder="Disponibilités"
        boxStyles={{
          borderWidth: 1,
          borderColor: "#374151",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          backgroundColor: "#111827",
        }}
        dropdownStyles={{
          borderWidth: 1,
          borderColor: "#374151",
          borderRadius: 8,
          backgroundColor: "#111827",
        }}
        inputStyles={{ color: "#fff" }}
        dropdownTextStyles={{ color: "#fff" }}
        search={false}
      />

      {error ? (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      ) : null}

      <View className="space-y-3 px-8 mb-4">
        <Pressable
          className={`bg-orange-500 py-3 rounded-full items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-sm font-semibold text-white">
              Sauvegarder mon profil
            </Text>
          )}
        </Pressable>

        <Pressable
          className="py-3 rounded-full items-center border border-orange-500"
          onPress={() => router.push("/(tabs)/Homepage")}
        >
          <Text className="text-sm font-semibold text-orange-500">
            Passer cette étape
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
