import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/api/auth";

export default function SignUpForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bio: "",
    level: "",
    email: "",
    password: "",
    password_confirmation: "",
    image: "",
  });

  const levelOptions = [
    { key: "beginner", value: "Débutant" },
    { key: "intermediate", value: "Intermédiaire" },
    { key: "expert", value: "Expert" },
  ];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
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
        handleChange("image", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image:", error);
      setError("Erreur lors de la sélection de l'image");
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await authService.signUp(formData);
      await login(response);
      router.replace("/(tabs)/homepage");
    } catch (err) {
      console.error("Erreur inscription:", err);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-black px-5 py-6">
      <Text className="text-2xl font-bold mb-6 text-center text-white">
        Inscription
      </Text>

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Nom"
        placeholderTextColor="#9CA3AF"
        value={formData.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Âge"
        placeholderTextColor="#9CA3AF"
        value={formData.age}
        onChangeText={(value) => handleChange("age", value)}
        keyboardType="numeric"
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white h-24"
        placeholder="Bio"
        placeholderTextColor="#9CA3AF"
        value={formData.bio}
        onChangeText={(value) => handleChange("bio", value)}
        multiline
        numberOfLines={3}
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

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Mot de passe"
        placeholderTextColor="#9CA3AF"
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Confirmation du mot de passe"
        placeholderTextColor="#9CA3AF"
        value={formData.password_confirmation}
        onChangeText={(value) => handleChange("password_confirmation", value)}
        secureTextEntry
      />

      <Pressable
        onPress={pickImage}
        className="w-full border border-gray-700 rounded-full p-4 mb-4 items-center justify-center bg-gray-900"
      >
        {formData.image ? (
          <View className="items-center">
            <Image
              source={{ uri: formData.image }}
              className="w-20 h-20 rounded-full mb-2"
            />
            <Text className="text-orange-500">Changer l'image</Text>
          </View>
        ) : (
          <Text className="text-orange-500">
            Sélectionner une image de profil
          </Text>
        )}
      </Pressable>

      {error ? (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      ) : null}

      <View className="space-y-3 px-8 mb-4">
        <Pressable
          className={`bg-orange-500 py-3 rounded-full items-center
            ${loading ? "opacity-70" : ""}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-sm font-semibold text-white">S'inscrire</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
