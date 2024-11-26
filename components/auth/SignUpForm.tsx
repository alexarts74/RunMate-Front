import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { authService } from "@/service/api/auth";

export default function SignUpForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgePicker, setShowAgePicker] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    location: "",
    profile_image: "",
    bio: "",
  });

  const genderOptions = [
    { key: "male", value: "Homme" },
    { key: "female", value: "Femme" },
    { key: "other", value: "Autre" },
  ];

  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18);

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
        handleChange("profile_image", result.assets[0].uri);
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
      router.replace("/(tabs)/RunnerProfile");
    } catch (err) {
      console.error("Erreur inscription:", err);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 mt-12 bg-dark px-5 py-6">
      <Text className="text-2xl font-bold mb-6 text-center text-white">
        Inscription
      </Text>

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

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Prénom"
        placeholderTextColor="#9CA3AF"
        value={formData.first_name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Nom"
        placeholderTextColor="#9CA3AF"
        value={formData.last_name}
        onChangeText={(value) => handleChange("last_name", value)}
      />

      <TouchableOpacity
        onPress={() => setShowAgePicker(true)}
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900"
      >
        <Text className="text-white">
          {formData.age ? `${formData.age} ans` : "Sélectionnez votre âge"}
        </Text>
      </TouchableOpacity>

      <SelectList
        setSelected={(val: string) => handleChange("gender", val)}
        data={genderOptions}
        save="key"
        placeholder="Sélectionnez votre genre"
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
        placeholder="Localisation"
        placeholderTextColor="#9CA3AF"
        value={formData.location}
        onChangeText={(value) => handleChange("location", value)}
      />

      <TextInput
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900 text-white"
        placeholder="Bio"
        placeholderTextColor="#9CA3AF"
        value={formData.bio}
        onChangeText={(value) => handleChange("bio", value)}
        multiline
      />

      <Pressable
        onPress={pickImage}
        className="w-full border border-gray-700 rounded-lg p-4 mb-4 items-center justify-center bg-gray-900"
      >
        {formData.profile_image ? (
          <View className="items-center">
            <Image
              source={{ uri: formData.profile_image }}
              className="w-20 h-20 rounded-full mb-2"
            />
            <Text className="text-white">Changer l'image</Text>
          </View>
        ) : (
          <Text className="text-white">
            Sélectionner une image de profil
          </Text>
        )}
      </Pressable>

      <Modal visible={showAgePicker} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-gray-900 w-full p-4">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={() => setShowAgePicker(false)}>
                <Text className="text-white">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!formData.age) {
                    handleChange("age", "18");
                  }
                  setShowAgePicker(false);
                }}
              >
                <Text className="text-white">Confirmer</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={formData.age}
              onValueChange={(value) => handleChange("age", value.toString())}
              style={{ color: "#fff" }}
            >
              {ageOptions.map((age) => (
                <Picker.Item
                  key={age}
                  label={`${age} ans`}
                  value={age.toString()}
                  style={{ color: "#fff" }}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>

      {error ? (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      ) : null}

      <View className="space-y-3 px-8 mb-4">
        <Pressable
          className={`bg-white py-3 rounded-full items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-sm font-semibold text-dark">S'inscrire</Text>
          )}
        </Pressable>
        <Pressable
          className={`bg-transparent border border-white py-3 rounded-full items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={() => router.replace("/(auth)/login")}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-sm font-semibold text-white">
              Se connecter
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
