import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { groupService } from "@/service/api/group";
import { UserSearch } from "@/components/UserSearch";
import User from "@/interface/User";

interface CreateGroupForm {
  name: string;
  description: string;
  location: string;
  max_members: string;
  level: string;
}

export function CreateGroupForm() {
  const [form, setForm] = useState<CreateGroupForm>({
    name: "",
    description: "",
    location: "",
    max_members: "",
    level: "intermediate",
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSelect = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

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
        invited_members: selectedUsers.map((user) => user.id),
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
      <View>
        <Text className="text-white text-lg mb-2 bg-red-500">
          Nom du groupe
        </Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Ex: Coureurs du dimanche"
          placeholderTextColor="#394047"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
      </View>

      <View>
        <Text className="text-white text-lg mb-2">Description</Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Décrivez votre groupe"
          placeholderTextColor="#394047"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
      </View>

      <View>
        <Text className="text-white text-lg mb-2">Lieu</Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Ex: Paris"
          placeholderTextColor="#394047"
          value={form.location}
          onChangeText={(text) => setForm({ ...form, location: text })}
        />
      </View>

      <View>
        <Text className="text-white text-lg mb-2">
          Nombre maximum de membres
        </Text>
        <TextInput
          className="bg-[#1e2429] text-white p-4 rounded-xl"
          placeholder="Ex: 20"
          placeholderTextColor="#394047"
          keyboardType="numeric"
          value={form.max_members}
          onChangeText={(text) => setForm({ ...form, max_members: text })}
        />
      </View>

      <View>
        <Text className="text-white text-lg mb-2">Inviter des membres</Text>
        <UserSearch
          onSelectUser={handleUserSelect}
          selectedUsers={selectedUsers}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={isLoading}
        className="bg-green py-3 px-6 rounded-xl active:opacity-90 mx-auto mt-6"
      >
        <Text className="text-[#12171b] text-center font-bold text-base">
          {isLoading ? "Création..." : "Créer le groupe"}
        </Text>
      </Pressable>
    </View>
  );
}
