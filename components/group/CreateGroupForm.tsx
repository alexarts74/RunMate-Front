import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { groupService } from "@/service/api/group";

type CreateGroupForm = {
  name: string;
  description: string;
  location: string;
  max_members: string;
  level: "beginner" | "intermediate" | "advanced";
};

export function CreateGroupForm() {
  const [form, setForm] = useState<CreateGroupForm>({
    name: "",
    description: "",
    location: "",
    max_members: "",
    level: "intermediate",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.location ||
      !form.max_members
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      await groupService.createGroup({
        ...form,
        max_members: parseInt(form.max_members),
      });
      Alert.alert("Succès", "Groupe créé avec succès");
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer le groupe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="space-y-4">
      {/* Nom du groupe */}
      <View>
        <Text className="text-white mb-2">Nom du groupe</Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Ex: Runners de Sallanches"
          placeholderTextColor="#6B7280"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
      </View>

      {/* Description */}
      <View>
        <Text className="text-white mb-2">Description</Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Décrivez votre groupe"
          placeholderTextColor="#6B7280"
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
      </View>

      {/* Localisation */}
      <View>
        <Text className="text-white mb-2">Localisation</Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Ex: Sallanches, Haute-Savoie"
          placeholderTextColor="#6B7280"
          value={form.location}
          onChangeText={(text) => setForm({ ...form, location: text })}
        />
      </View>

      {/* Nombre max de membres */}
      <View>
        <Text className="text-white mb-2">Nombre maximum de membres</Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Ex: 20"
          placeholderTextColor="#6B7280"
          keyboardType="numeric"
          value={form.max_members}
          onChangeText={(text) => setForm({ ...form, max_members: text })}
        />
      </View>

      {/* Niveau */}
      <View>
        <Text className="text-white mb-2">Niveau</Text>
        <View className="flex-row justify-between">
          {["beginner", "intermediate", "advanced"].map((level) => (
            <Pressable
              key={level}
              onPress={() => setForm({ ...form, level: level as any })}
              className={`flex-1 mx-1 p-3 rounded-xl ${
                form.level === level ? "bg-green" : "bg-[#1e2429]"
              }`}
            >
              <Text
                className={`text-center ${
                  form.level === level ? "text-[#12171b]" : "text-white"
                }`}
              >
                {level === "beginner"
                  ? "Débutant"
                  : level === "intermediate"
                  ? "Intermédiaire"
                  : "Avancé"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bouton de création */}
      <Pressable
        onPress={handleSubmit}
        disabled={isLoading}
        className={`mt-8 p-4 rounded-xl ${
          isLoading ? "bg-gray-500" : "bg-green"
        }`}
      >
        <Text className="text-center text-[#12171b] font-bold text-lg">
          {isLoading ? "Création..." : "Créer le groupe"}
        </Text>
      </Pressable>
    </View>
  );
}
