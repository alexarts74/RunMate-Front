import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { groupService } from "@/service/api/group";
import { UserSearch } from "@/components/UserSearch";
import User from "@/interface/User";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface CreateGroupForm {
  name: string;
  description: string;
  cover_image: string;
  location: string;
  level: string;
  max_members: number;
}

export function CreateGroupForm() {
  const [form, setForm] = useState<CreateGroupForm>({
    name: "",
    description: "",
    cover_image: "",
    location: "",
    level: "",
    max_members: 0,
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, cover_image: result.assets[0].uri });
    }
  };

  const handleUserSelect = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const groupData = {
        name: form.name,
        description: form.description,
        cover_image: form.cover_image,
        invited_members: selectedUsers.map((user) => user.id),
        location: form.location,
        level: form.level,
        max_members: form.max_members,
      };

      await groupService.createGroup(groupData);
      Alert.alert("Succès", "Groupe créé avec succès");
      router.back();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer le groupe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <View className="space-y-5">
        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Image de couverture</Text>
          <Pressable
            onPress={handleImagePick}
            className="bg-white rounded-2xl overflow-hidden h-48 items-center justify-center border-2 border-dashed border-gray-300"
            style={{
              shadowColor: "#A78BFA",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {form.cover_image ? (
              <Image
                source={{ uri: form.cover_image }}
                className="w-full h-full"
                style={{ resizeMode: "cover" }}
              />
            ) : (
              <View className="items-center">
                <View className="w-16 h-16 rounded-xl bg-tertiary items-center justify-center mb-3">
                  <Ionicons name="image-outline" size={32} color="#A78BFA" />
                </View>
                <Text className="text-gray-600 font-kanit-medium text-base">
                  Ajouter une image de couverture
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Nom du groupe</Text>
          <TextInput
            className="bg-white text-gray-900 p-4 rounded-xl border-2 border-gray-200 font-kanit-medium"
            placeholder="Ex: Coureurs du dimanche"
            placeholderTextColor="#9CA3AF"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Description</Text>
          <TextInput
            className="bg-white text-gray-900 p-4 rounded-xl border-2 border-gray-200 font-kanit-medium"
            placeholder="Décrivez votre groupe"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.description}
            onChangeText={(text) => setForm({ ...form, description: text })}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Localisation</Text>
          <TextInput
            className="bg-white text-gray-900 p-4 rounded-xl border-2 border-gray-200 font-kanit-medium"
            placeholder="Ex: Paris, France"
            placeholderTextColor="#9CA3AF"
            value={form.location}
            onChangeText={(text) => setForm({ ...form, location: text })}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Niveau</Text>
          <TextInput
            className="bg-white text-gray-900 p-4 rounded-xl border-2 border-gray-200 font-kanit-medium"
            placeholder="Ex: Débutant, Intermédiaire, Avancé"
            placeholderTextColor="#9CA3AF"
            value={form.level}
            onChangeText={(text) => setForm({ ...form, level: text })}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Nombre de membres</Text>
          <TextInput
            className="bg-white text-gray-900 p-4 rounded-xl border-2 border-gray-200 font-kanit-medium"
            placeholder="Ex: 10"
            placeholderTextColor="#9CA3AF"
            value={form.max_members.toString()}
            onChangeText={(text) =>
              setForm({ ...form, max_members: parseInt(text) || 0 })
            }
            keyboardType="numeric"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-900 font-kanit-bold text-base mb-2">Inviter des membres</Text>
          <UserSearch
            onSelectUser={handleUserSelect}
            selectedUsers={selectedUsers}
          />
        </View>
      </View>

      <View className="mt-8 mb-6">
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="bg-secondary py-4 px-8 rounded-full active:opacity-90"
          style={{
            shadowColor: "#A78BFA",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-white text-center font-kanit-bold text-lg">
            {isLoading ? "Création..." : "Créer le groupe"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
