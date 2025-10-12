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
      <ScrollView>
        <View className="space-y-4 p-2 pb-20">
          <View>
            <Text className="text-white text-lg mb-2">Image de couverture</Text>
            <Pressable
              onPress={handleImagePick}
              className="bg-[#1e2429] rounded-xl overflow-hidden h-48 items-center justify-center"
            >
              {form.cover_image ? (
                <Image
                  source={{ uri: form.cover_image }}
                  className="w-full h-full"
                  style={{ resizeMode: "cover" }}
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="image-outline" size={48} color="#394047" />
                  <Text className="text-[#394047] mt-2">
                    Ajouter une image de couverture
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          <View>
            <Text className="text-white text-lg mb-2">Nom du groupe</Text>
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
            <Text className="text-white text-lg mb-2">Inviter des membres</Text>
            <UserSearch
              onSelectUser={handleUserSelect}
              selectedUsers={selectedUsers}
            />
          </View>
        </View>

        <View>
          <Text className="text-white text-lg mb-2">Localisation</Text>
          <TextInput
            className="bg-[#1e2429] text-white p-4 rounded-xl"
            placeholder="Ex: Paris, France"
            placeholderTextColor="#394047"
            value={form.location}
            onChangeText={(text) => setForm({ ...form, location: text })}
          />
        </View>

        <View>
          <Text className="text-white text-lg mb-2">Niveau</Text>
          <TextInput
            className="bg-[#1e2429] text-white p-4 rounded-xl"
            placeholder="Ex: Débutant, Intermédiaire, Avancé"
            placeholderTextColor="#394047"
            value={form.level}
            onChangeText={(text) => setForm({ ...form, level: text })}
          />
        </View>

        <View>
          <Text className="text-white text-lg mb-2">Nombre de membres</Text>
          <TextInput
            className="bg-[#1e2429] text-white p-4 rounded-xl"
            placeholder="Ex: 10"
            placeholderTextColor="#394047"
            value={form.max_members.toString()}
            onChangeText={(text) =>
              setForm({ ...form, max_members: parseInt(text) })
            }
            keyboardType="numeric"
          />
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#394047] bg-background">
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="bg-purple py-3 px-6 rounded-xl active:opacity-90 mx-auto"
        >
          <Text className="text-background text-center font-bold text-base">
            {isLoading ? "Création..." : "Créer le groupe"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
