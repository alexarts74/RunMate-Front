import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpFormStep2 } from "@/constants/formValidation";
import { Ionicons } from "@expo/vector-icons";
import { GenderSelect } from "../GenderSelect";
import { ActionButton } from "../ui/ActionButton";

interface SignUpFormStep2Props {
  formData: {
    first_name: string;
    last_name: string;
    age: string;
    gender: string;
    bio: string;
    profile_image: string;
  };
  runnerType: "chill" | "perf" | null;
  onBack: () => void;
  onNext: () => void;
  handleChange: (name: string, value: string) => void;
}

export function SignUpFormStep2({
  formData,
  runnerType,
  onBack,
  onNext,
  handleChange,
}: SignUpFormStep2Props) {
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ageOptions = Array.from({ length: 83 }, (_, i) => i + 18);

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

  useEffect(() => {
    const checkFormValidity = () => {
      validateSignUpFormStep2(formData);
      const hasAllRequiredFields =
        formData.first_name.trim() !== "" &&
        formData.last_name.trim() !== "" &&
        formData.age !== "" &&
        formData.bio !== "" &&
        formData.gender !== "" &&
        formData.profile_image !== "";

      setIsFormValid(hasAllRequiredFields);
    };
    checkFormValidity();
  }, [formData]);

  const handleSubmit = () => {
    setIsLoading(true);
    clearErrors();
    if (validateForm(validateSignUpFormStep2(formData))) {
      onNext();
    }
    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-fond px-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-[15%] mt-8 flex-row items-center">
          <Pressable
            onPress={onBack}
            className="bg-white p-2.5 rounded-full active:opacity-80"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#FF6B4A" />
          </Pressable>

          <View className="flex-1">
            <Text className="text-gray-900 text-2xl mr-8 font-kanit-bold text-center">
              Dis nous en{"\n"}
              <Text className="text-primary">plus sur toi</Text>
            </Text>
          </View>
        </View>

        <View className="space-y-5 mt-4">
          <View>
            <Text className="text-gray-900 text-sm font-kanit-bold mb-2">
              Prénom*
            </Text>
            <TextInput
              className={`w-full border-2 rounded-full p-4 bg-white text-gray-900 font-kanit-medium ${
                focusedInput === "first_name"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="Prénom"
              placeholderTextColor="#9CA3AF"
              value={
                formData.first_name.charAt(0).toUpperCase() +
                formData.first_name.slice(1)
              }
              onChangeText={(value) => handleChange("first_name", value)}
              onFocus={() => setFocusedInput("first_name")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "first_name" ? "#FF6B4A" : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "first_name" ? 0.15 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
            {errors.first_name && (
              <Text className="text-red-500 text-sm mt-1.5 font-kanit-medium">
                {errors.first_name}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-gray-900 text-sm font-kanit-bold mb-2">
              Nom*
            </Text>
            <TextInput
              className={`w-full border-2 rounded-full p-4 bg-white text-gray-900 font-kanit-medium ${
                focusedInput === "last_name"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="Nom"
              placeholderTextColor="#9CA3AF"
              value={
                formData.last_name.charAt(0).toUpperCase() +
                formData.last_name.slice(1)
              }
              onChangeText={(value) => handleChange("last_name", value)}
              onFocus={() => setFocusedInput("last_name")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "last_name" ? "#FF6B4A" : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "last_name" ? 0.15 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
            {errors.last_name && (
              <Text className="text-red-500 text-sm mt-1.5 font-kanit-medium">
                {errors.last_name}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-gray-900 text-sm font-kanit-bold mb-2">
              Âge*
            </Text>
            <TouchableOpacity
              onPress={() => setShowAgePicker(true)}
              className={`w-full border-2 rounded-full p-4 bg-white ${
                focusedInput === "age" ? "border-primary" : "border-gray-200"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Text className="text-gray-900 font-kanit-medium">
                {formData.age
                  ? `${formData.age} ans`
                  : "Sélectionnez votre âge"}
              </Text>
            </TouchableOpacity>
            {errors.age && (
              <Text className="text-red-500 text-sm mt-1.5 font-kanit-medium">{errors.age}</Text>
            )}
          </View>

          <View>
            <Text className="text-gray-900 text-sm font-kanit-bold mb-2">
              Genre*
            </Text>
            <GenderSelect
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
            />
            {errors.gender && (
              <Text className="text-red-500 text-sm mt-1.5 font-kanit-medium">{errors.gender}</Text>
            )}
          </View>

          <View>
            <Text className="text-gray-900 text-sm font-kanit-bold mb-2">
              Bio*
            </Text>
            <TextInput
              className={`w-full border-2 rounded-full p-4 bg-white text-gray-900 font-kanit-medium ${
                focusedInput === "bio" ? "border-primary" : "border-gray-200"
              }`}
              placeholder="Parle-nous de toi..."
              placeholderTextColor="#9CA3AF"
              value={formData.bio}
              onChangeText={(value) => handleChange("bio", value)}
              onFocus={() => setFocusedInput("bio")}
              onBlur={() => setFocusedInput(null)}
              multiline
              numberOfLines={2}
              style={{ 
                height: 50, 
                textAlignVertical: "top",
                shadowColor: focusedInput === "bio" ? "#FF6B4A" : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "bio" ? 0.15 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          <View className="mb-8">
            <Text className="text-gray-900 text-sm font-kanit-bold mb-2">
              Photo de profil*
            </Text>
            <Pressable
              onPress={pickImage}
              className={`w-full border-2 rounded-2xl p-6 items-center justify-center bg-white ${
                focusedInput === "profile_image"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {formData.profile_image ? (
                <View className="items-center">
                  <Image
                    source={{ uri: formData.profile_image }}
                    className="w-20 h-20 rounded-full mb-3 border-2 border-primary"
                  />
                  <Text className="text-gray-900 font-kanit-medium">Changer l'image</Text>
                </View>
              ) : (
                <View className="items-center">
                  <View className="w-16 h-16 rounded-xl bg-tertiary items-center justify-center mb-3">
                    <Ionicons name="camera-outline" size={32} color="#FF6B4A" />
                  </View>
                  <Text className="text-gray-600 font-kanit-medium">
                    Sélectionner une image de profil
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      <View className="absolute bottom-0 left-0 w-full right-0 pb-8 pt-4 bg-fond border-t border-gray-200">
        <ActionButton
          text="Continuer"
          onPress={handleSubmit}
          loading={isLoading}
        />
      </View>

      <Modal visible={showAgePicker} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white w-full p-4 rounded-t-3xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 text-lg font-kanit-bold">
                Sélectionnez votre âge
              </Text>
              <Pressable onPress={() => setShowAgePicker(false)}>
                <Ionicons name="close" size={24} color="#FF6B4A" />
              </Pressable>
            </View>
            <Picker
              selectedValue={formData.age}
              onValueChange={(itemValue) => {
                handleChange("age", itemValue.toString());
                setShowAgePicker(false);
              }}
              style={{ color: "#1F2937" }}
            >
              {ageOptions.map((age) => (
                <Picker.Item
                  key={age}
                  label={`${age} ans`}
                  value={age.toString()}
                  color="#1F2937"
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}
