import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { groupService } from "@/service/api/group";
import { UserSearch } from "@/components/UserSearch";
import User from "@/interface/User";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors } from "@/constants/theme";

interface CreateGroupFormData {
  name: string;
  description: string;
  cover_image: string;
  location: string;
  level: string;
  max_members: number;
}

export function CreateGroupForm() {
  const { user } = useAuth();
  const { colors, shadows } = useThemeColors();
  const [form, setForm] = useState<CreateGroupFormData>({
    name: "",
    description: "",
    cover_image: "",
    location: "",
    level: "",
    max_members: 0,
  });

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est organisateur
  useEffect(() => {
    if (user?.user_type !== "organizer") {
      Alert.alert(
        "Accès restreint",
        "Seuls les organisateurs peuvent créer des groupes. Veuillez créer un compte organisateur pour accéder à cette fonctionnalité.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }
  }, [user]);

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
    } catch (error: any) {
      const errorMessage =
        error.message || "Impossible de créer le groupe";
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <View style={{ gap: 20 }}>
        <View>
          <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base mb-2">Image de couverture</Text>
          <Pressable
            onPress={handleImagePick}
            className="rounded-2xl overflow-hidden h-48 items-center justify-center"
            style={{
              backgroundColor: colors.glass.light,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: colors.glass.border,
              ...shadows.sm,
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
                <View
                  className="w-16 h-16 rounded-xl items-center justify-center mb-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Ionicons name="image-outline" size={32} color={colors.text.secondary} />
                </View>
                <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-base">
                  Ajouter une image de couverture
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        <GlassInput
          label="Nom du groupe"
          placeholder="Ex: Coureurs du dimanche"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <GlassInput
          label="Description"
          placeholder="Décrivez votre groupe"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />

        <GlassInput
          label="Localisation"
          placeholder="Ex: Paris, France"
          value={form.location}
          onChangeText={(text) => setForm({ ...form, location: text })}
        />

        <GlassInput
          label="Niveau"
          placeholder="Ex: Débutant, Intermédiaire, Avancé"
          value={form.level}
          onChangeText={(text) => setForm({ ...form, level: text })}
        />

        <GlassInput
          label="Nombre de membres"
          placeholder="Ex: 10"
          value={form.max_members.toString()}
          onChangeText={(text) =>
            setForm({ ...form, max_members: parseInt(text) || 0 })
          }
          keyboardType="numeric"
        />

        <View>
          <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base mb-2">Inviter des membres</Text>
          <UserSearch
            onSelectUser={handleUserSelect}
            selectedUsers={selectedUsers}
          />
        </View>
      </View>

      <View className="mt-8 mb-6">
        <GlassButton
          title={isLoading ? "Création..." : "Créer le groupe"}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          size="lg"
        />
      </View>
    </View>
  );
}
