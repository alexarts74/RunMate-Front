import React, { useState } from "react";
import { View, TextInput, Pressable, Text, ScrollView, ActivityIndicator } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useAuth } from "@/context/AuthContext";

type ProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileEditForm({ setIsEditing }: ProfileEditFormProps) {

  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({

    email: user?.email || "",
    name: user?.name || "",
    last_name: user?.last_name || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    location: user?.location || "",
    profile_image: user?.profile_image || "",
    bio: user?.bio || "",
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
    console.log("Début de handleSubmit");
    console.log("formData", formData);
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  console.log("formData", formData);

  const genderOptions = [
    { key: "male", value: "Homme" },
    { key: "female", value: "Femme" },
    { key: "other", value: "Autre" },
  ];

  return (
    <ScrollView
      className="flex-1 bg-[#12171b] px-5 py-6 pt-12"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <Text className="text-2xl font-bold mb-6 mt-6 text-white">
        Modifier mon profil
      </Text>

      <Pressable onPress={pickImage} className="items-center mb-6">
        <Image
          source={
            formData.profile_image
              ? { uri: formData.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full border-2 border-green"
        />
        <Text className="text-white mt-2">Changer la photo</Text>
      </Pressable>

      <View className="space-y-4">
        <TextInput
          className="w-full border border-gray rounded-lg p-4 bg-gray text-white"
          placeholder="Prénom"
          placeholderTextColor="#9CA3AF"
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
        />

        <TextInput
          className="w-full border border-gray rounded-lg p-4 bg-gray text-white"
          placeholder="Nom"
          placeholderTextColor="#9CA3AF"
          value={formData.last_name}
          onChangeText={(value) => handleChange("last_name", value)}
        />

        <TextInput
          className="w-full border border-gray rounded-lg p-4 bg-gray text-white"
          placeholder="Âge"
          placeholderTextColor="#9CA3AF"
          value={formData.age}
          onChangeText={(value) => handleChange("age", value)}
          keyboardType="numeric"
        />

        <SelectList
          setSelected={(val: string) => handleChange("gender", val)}
          data={genderOptions}
          save="key"
          defaultOption={{ key: formData.gender, value: formData.gender }}
          placeholder="Sélectionnez votre genre"
          boxStyles={{
            borderWidth: 1,
            borderColor: "#394047",
            borderRadius: 8,
            padding: 16,
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
        />

        <TextInput
          className="w-full border border-gray rounded-lg p-4 bg-gray text-white"
          placeholder="Localisation"
          placeholderTextColor="#9CA3AF"
          value={formData.location}
          onChangeText={(value) => handleChange("location", value)}
        />

        <TextInput
          className="w-full border border-gray rounded-lg p-4 bg-gray text-white"
          placeholder="Bio"
          placeholderTextColor="#9CA3AF"
          value={formData.bio}
          onChangeText={(value) => handleChange("bio", value)}
          multiline
          numberOfLines={4}
        />
      </View>

      {error ? (
        <Text className="text-red-500 text-center mt-4">{error}</Text>
      ) : null}

      <View className="space-y-3 px-8 mb-4 mt-6">
        <Pressable
          className="bg-green py-3 rounded-full items-center"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#12171b" />
          ) : (
            <Text className="text-dark font-semibold">Enregistrer</Text>
          )}
        </Pressable>
        <Pressable
          className="bg-transparent border border-green py-3 rounded-full items-center"
          onPress={() => setIsEditing(false)}
        >
          <Text className="text-green font-semibold">Annuler</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
