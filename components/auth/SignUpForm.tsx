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
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SignUpForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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
      console.log("Réponse signup:", response);

      if (!response.authentication_token) {
        console.error("Pas de token dans la réponse");
        setError("Erreur d'authentification");
        return;
      }

      await login(response);
      console.log("Login effectué, redirection...");
      router.replace("/(app)/runner/runner-profile");
    } catch (err) {
      console.error("Erreur inscription détaillée:", err);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 mt-12 bg-[#12171b] px-5 py-6"
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => router.replace("/")}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-white flex-1 text-center">
          Inscription
        </Text>
      </View>

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'email' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
        onFocus={() => setFocusedInput('email')}
        onBlur={() => setFocusedInput(null)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'password' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Mot de passe"
        placeholderTextColor="#9CA3AF"
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
        onFocus={() => setFocusedInput('password')}
        onBlur={() => setFocusedInput(null)}
        secureTextEntry
      />

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'password_confirmation' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Confirmation du mot de passe"
        placeholderTextColor="#9CA3AF"
        value={formData.password_confirmation}
        onChangeText={(value) => handleChange("password_confirmation", value)}
        onFocus={() => setFocusedInput('password_confirmation')}
        onBlur={() => setFocusedInput(null)}
        secureTextEntry
      />

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'first_name' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Prénom"
        placeholderTextColor="#9CA3AF"
        value={formData.first_name}
        onChangeText={(value) => handleChange("first_name", value)}
        onFocus={() => setFocusedInput('first_name')}
        onBlur={() => setFocusedInput(null)}
      />

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'last_name' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Nom"
        placeholderTextColor="#9CA3AF"
        value={formData.last_name}
        onChangeText={(value) => handleChange("last_name", value)}
        onFocus={() => setFocusedInput('last_name')}
        onBlur={() => setFocusedInput(null)}
      />

      <TouchableOpacity
        onPress={() => setShowAgePicker(true)}
        className={`w-full border rounded-lg p-4 mb-4 bg-gray ${
          focusedInput === 'age' ? 'border-green' : 'border-gray'
        }`}
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
          borderColor: focusedInput === 'gender' ? "#b9f144" : "#394047",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          backgroundColor: "#394047",
        }}
        dropdownStyles={{
          borderWidth: 1,
          borderColor: "#394047",
          borderRadius: 8,
          backgroundColor: "#394047",
        }}
        inputStyles={{ color: "#fff" }}
        dropdownTextStyles={{ color: "#fff" }}
        search={false}
        onFocus={() => setFocusedInput('gender')}
        onBlur={() => setFocusedInput(null)}
      />

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'location' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Localisation"
        placeholderTextColor="#9CA3AF"
        value={formData.location}
        onChangeText={(value) => handleChange("location", value)}
        onFocus={() => setFocusedInput('location')}
        onBlur={() => setFocusedInput(null)}
      />

      <TextInput
        className={`w-full border rounded-lg p-4 mb-4 bg-gray text-white ${
          focusedInput === 'bio' ? 'border-green' : 'border-gray'
        }`}
        placeholder="Bio"
        placeholderTextColor="#9CA3AF"
        value={formData.bio}
        onChangeText={(value) => handleChange("bio", value)}
        onFocus={() => setFocusedInput('bio')}
        onBlur={() => setFocusedInput(null)}
        multiline
      />

      <Pressable
        onPress={pickImage}
        className={`w-full border rounded-lg p-4 mb-4 items-center justify-center bg-gray ${
          focusedInput === 'profile_image' ? 'border-green' : 'border-gray'
        }`}
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
          <View className="bg-gray w-full p-4">
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
          className={`bg-green py-3 rounded-full items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#1a2126" />
          ) : (
            <Text className="text-sm font-semibold text-dark">S'inscrire</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
