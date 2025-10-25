import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useAuth } from "@/context/AuthContext";
import User from "@/interface/User";

type ProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileEditForm({ setIsEditing }: ProfileEditFormProps) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    profile_image: user?.profile_image || "",
    bio: user?.bio || "",
    location: user?.city || "",
    department: user?.department || "",
    level: user?.level || "beginner",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleChange("profile_image", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const userUpdate = {
        ...formData,
        age: parseInt(formData.age) || 0,
        city: formData.location || "",
        id: user?.id || 0,
        department: formData.department || "",
        level: formData.level || "beginner",
      } as User;

      await updateUser(userUpdate);
      setIsEditing(false);
      setLoading(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { key: "male", value: "Homme" },
    { key: "female", value: "Femme" },
    { key: "other", value: "Autre" },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background px-5 py-6 pt-12"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <Text className="text-2xl font-bold mb-6 text-white">
        Modifier mon profil
      </Text>

      <Pressable onPress={pickImage} className="items-center mb-8">
        <Image
          source={
            formData.profile_image
              ? { uri: formData.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full border-2 border-purple"
        />
        <Text className="text-purple mt-2 font-semibold">Changer la photo</Text>
      </Pressable>

      <View className="space-y-4">
        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Prénom
          </Text>
          <TextInput
            className={`w-full border rounded-full p-4 bg-background text-white ${
              focusedInput === "first_name"
                ? "border-purple"
                : "border-[#2a3238]"
            }`}
            placeholder="Prénom"
            placeholderTextColor="#9CA3AF"
            value={formData.first_name}
            onChangeText={(value) => handleChange("first_name", value)}
            onFocus={() => setFocusedInput("first_name")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Nom
          </Text>
          <TextInput
            className={`w-full border rounded-full p-4 bg-background text-white ${
              focusedInput === "last_name"
                ? "border-purple"
                : "border-[#2a3238]"
            }`}
            placeholder="Nom"
            placeholderTextColor="#9CA3AF"
            value={formData.last_name}
            onChangeText={(value) => handleChange("last_name", value)}
            onFocus={() => setFocusedInput("last_name")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Âge
          </Text>
          <TextInput
            className={`w-full border rounded-full p-4 bg-background text-white ${
              focusedInput === "age" ? "border-purple" : "border-[#2a3238]"
            }`}
            placeholder="Âge"
            placeholderTextColor="#9CA3AF"
            value={formData.age}
            onChangeText={(value) => handleChange("age", value)}
            onFocus={() => setFocusedInput("age")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
          />
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Genre
          </Text>
          <SelectList
            setSelected={(val: string) => handleChange("gender", val)}
            data={genderOptions}
            save="key"
            defaultOption={{ key: formData.gender, value: formData.gender }}
            placeholder="Sélectionnez votre genre"
            boxStyles={{
              borderWidth: 1,
              borderColor: focusedInput === "gender" ? "#126C52" : "#2a3238",
              borderRadius: 9999,
              padding: 16,
              backgroundColor: "#background",
            }}
            dropdownStyles={{
              borderWidth: 1,
              borderColor: "#2a3238",
              borderRadius: 16,
              backgroundColor: "#background",
              marginTop: 4,
            }}
            inputStyles={{ color: "#fff" }}
            dropdownTextStyles={{ color: "#fff" }}
            search={false}
          />
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Bio
          </Text>
          <TextInput
            className={`w-full border rounded-2xl p-4 bg-background text-white ${
              focusedInput === "bio" ? "border-purple" : "border-[#2a3238]"
            }`}
            placeholder="Bio"
            placeholderTextColor="#9CA3AF"
            value={formData.bio}
            onChangeText={(value) => handleChange("bio", value)}
            onFocus={() => setFocusedInput("bio")}
            onBlur={() => setFocusedInput(null)}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {error ? (
        <Text className="text-red-500 text-center mt-4">{error}</Text>
      ) : null}

      <View className="space-y-3 mt-6">
        <Pressable
          className="bg-purple py-4 rounded-full items-center"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold">Enregistrer</Text>
          )}
        </Pressable>
        <Pressable
          className="bg-transparent border border-purple py-4 rounded-full items-center"
          onPress={() => setIsEditing(false)}
        >
          <Text className="text-purple font-semibold">Annuler</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
