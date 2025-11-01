import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-fond px-6 py-6 pt-6"
        contentContainerStyle={{ paddingBottom: 150 }}
      >
      <Text className="text-2xl font-kanit-bold mb-6 text-gray-900">
        Modifier mon profil
      </Text>

      <Pressable onPress={pickImage} className="items-center mb-8">
        <Image
          source={
            formData.profile_image
              ? { uri: formData.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full border-4 border-primary"
        />
        <Text className="text-primary mt-3 font-kanit-bold">Changer la photo</Text>
      </Pressable>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 text-sm font-kanit-bold pl-2 mb-2">
            Prénom
          </Text>
          <TextInput
            className={`w-full border rounded-full p-4 bg-white text-gray-900 font-kanit-medium ${
              focusedInput === "first_name"
                ? "border-primary"
                : "border-gray-200"
            }`}
            placeholder="Prénom"
            placeholderTextColor="#9CA3AF"
            value={formData.first_name}
            onChangeText={(value) => handleChange("first_name", value)}
            onFocus={() => setFocusedInput("first_name")}
            onBlur={() => setFocusedInput(null)}
            style={{
              shadowColor: focusedInput === "first_name" ? "#FF6B4A" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: focusedInput === "first_name" ? 0.1 : 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-kanit-bold pl-2 mb-2">
            Nom
          </Text>
          <TextInput
            className={`w-full border rounded-full p-4 bg-white text-gray-900 font-kanit-medium ${
              focusedInput === "last_name"
                ? "border-primary"
                : "border-gray-200"
            }`}
            placeholder="Nom"
            placeholderTextColor="#9CA3AF"
            value={formData.last_name}
            onChangeText={(value) => handleChange("last_name", value)}
            onFocus={() => setFocusedInput("last_name")}
            onBlur={() => setFocusedInput(null)}
            style={{
              shadowColor: focusedInput === "last_name" ? "#FF6B4A" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: focusedInput === "last_name" ? 0.1 : 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-kanit-bold pl-2 mb-2">
            Âge
          </Text>
          <TextInput
            className={`w-full border rounded-full p-4 bg-white text-gray-900 font-kanit-medium ${
              focusedInput === "age" ? "border-primary" : "border-gray-200"
            }`}
            placeholder="Âge"
            placeholderTextColor="#9CA3AF"
            value={formData.age}
            onChangeText={(value) => handleChange("age", value)}
            onFocus={() => setFocusedInput("age")}
            onBlur={() => setFocusedInput(null)}
            keyboardType="numeric"
            style={{
              shadowColor: focusedInput === "age" ? "#FF6B4A" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: focusedInput === "age" ? 0.1 : 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          />
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-kanit-bold pl-2 mb-2">
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
              borderColor: focusedInput === "gender" ? "#FF6B4A" : "#E5E7EB",
              borderRadius: 9999,
              padding: 16,
              backgroundColor: "#ffffff",
            }}
            dropdownStyles={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 16,
              backgroundColor: "#ffffff",
              marginTop: 4,
            }}
            inputStyles={{ color: "#111827", fontFamily: "Kanit-Medium" }}
            dropdownTextStyles={{ color: "#111827", fontFamily: "Kanit-Medium" }}
            search={false}
          />
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-kanit-bold pl-2 mb-2">
            Bio
          </Text>
          <TextInput
            className={`w-full border rounded-2xl p-4 bg-white text-gray-900 font-kanit-medium ${
              focusedInput === "bio" ? "border-primary" : "border-gray-200"
            }`}
            placeholder="Bio"
            placeholderTextColor="#9CA3AF"
            value={formData.bio}
            onChangeText={(value) => handleChange("bio", value)}
            onFocus={() => setFocusedInput("bio")}
            onBlur={() => setFocusedInput(null)}
            multiline
            numberOfLines={4}
            style={{
              shadowColor: focusedInput === "bio" ? "#FF6B4A" : "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: focusedInput === "bio" ? 0.1 : 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          />
        </View>
      </View>

      {error ? (
        <Text className="text-red-500 text-center mt-4 font-kanit-medium">{error}</Text>
      ) : null}

      <View className="space-y-3 mt-6">
        <Pressable
          className="bg-primary py-4 rounded-full items-center"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-kanit-bold">Enregistrer</Text>
          )}
        </Pressable>
        <Pressable
          className="bg-white border-2 border-gray-300 py-4 rounded-full items-center"
          onPress={() => setIsEditing(false)}
        >
          <Text className="text-gray-700 font-kanit-bold">Annuler</Text>
        </Pressable>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
