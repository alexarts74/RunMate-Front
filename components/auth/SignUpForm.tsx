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
import * as Location from "expo-location";
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validateSignUpForm } from "@/constants/formValidation";
import { SignUpFormStep1 } from "./SignUpFormStep1";
import { SignUpFormStep2 } from "./SignUpFormStep2";

export default function SignUpForm() {
  const { login } = useAuth();
  const { errors, validateForm, clearErrors } = useFormValidation();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    profile_image: "",
    bio: "",
    city: "",
    department: "",
    postcode: "",
    latitude: "",
    longitude: "",
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

  const handleLocationUpdate = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Permission de localisation refusée");
      }

      const location = await Location.getCurrentPositionAsync({});
      const [result] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (!result) {
        throw new Error("Impossible de déterminer votre localisation");
      }

      return {
        city: result.city || "",
        department: result.region || "",
        postcode: result.postalCode || "",
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (err) {
      console.error("Erreur de localisation:", err);
      throw new Error("Erreur lors de la récupération de la position");
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setError("");
      setLoading(true);

      const locationData = await handleLocationUpdate();
      const updatedFormData = {
        ...formData,
        ...locationData,
      };

      const response = await authService.signUp(updatedFormData);

      if (!response.authentication_token) {
        throw new Error("Pas de token dans la réponse");
      }

      await login(response);
      router.replace("/(app)/runner/runner-profile");
    } catch (err) {
      console.error("Erreur inscription détaillée:", err);
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 1 ? (
        <SignUpFormStep1
          formData={formData}
          onNext={() => setStep(2)}
          handleChange={handleChange}
        />
      ) : (
        <SignUpFormStep2
          formData={formData}
          onBack={() => setStep(1)}
          onSubmit={handleSignUp}
          handleChange={handleChange}
        />
      )}
    </>
  );
}
