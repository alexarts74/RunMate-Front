import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/api/auth";
import * as Location from "expo-location";
import { SignUpFormStep1 } from "./SignUpFormStep1";
import { SignUpFormStep2 } from "./SignUpFormStep2";
import { SignUpFormStep3 } from "./SignUpFormStep3";
import { runnerProfileService } from "@/service/api/runnerProfile";
import { signUpStorage } from "@/service/auth/storage";

export default function SignUpForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    bio: "",
    profile_image: "",
    actual_pace: "",
    usual_distance: "",
    availability: [],
    objective: "",
  });

  // Charger les données au montage du composant
  useEffect(() => {
    const loadSavedData = async () => {
      const savedStep = await signUpStorage.getSignUpStep();
      const savedData = await signUpStorage.getSignUpData();

      if (savedStep) setStep(savedStep);
      if (savedData) setFormData(savedData);
    };

    loadSavedData();
  }, []);

  // Sauvegarder les données à chaque changement
  const handleChange = async (name: string, value: any) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    await signUpStorage.saveSignUpData(newFormData);
  };

  const handleStepChange = async (newStep: number) => {
    setStep(newStep);
    await signUpStorage.saveSignUpStep(newStep);
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

  const handleFinalSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      // 1. Récupérer la localisation
      const locationData = await handleLocationUpdate();

      // 2. Créer le compte utilisateur
      const signUpResponse = await authService.signUp({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        first_name: formData.first_name,
        last_name: formData.last_name,
        age: formData.age,
        gender: formData.gender,
        bio: formData.bio,
        profile_image: formData.profile_image,
        city: locationData.city,
        department: locationData.department,
        postcode: locationData.postcode,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });

      // 3. Se connecter
      await login(signUpResponse);

      // 4. Créer le profil coureur
      const savedProfile = await runnerProfileService.save({
        actual_pace: formData.actual_pace,
        usual_distance: formData.usual_distance,
        availability: formData.availability,
        objective: formData.objective,
      });

      const updatedUserData = {
        ...signUpResponse,
        user: {
          ...signUpResponse.user,
          runner_profile: savedProfile,
        },
      };

      await login(updatedUserData);

      // 5. Nettoyer et rediriger
      await signUpStorage.clearSignUpData();
      router.replace("/(tabs)/matches");
    } catch (err) {
      console.error("Erreur finalisation inscription:", err);
      setError("Erreur lors de la finalisation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {step === 1 ? (
        <SignUpFormStep1
          formData={formData}
          onNext={() => handleStepChange(2)}
          handleChange={handleChange}
        />
      ) : step === 2 ? (
        <SignUpFormStep2
          formData={formData}
          onBack={() => handleStepChange(1)}
          onSubmit={() => handleStepChange(3)}
          handleChange={handleChange}
        />
      ) : (
        <SignUpFormStep3
          formData={formData}
          onBack={() => handleStepChange(2)}
          onSubmit={handleFinalSubmit}
          handleChange={handleChange}
        />
      )}
    </>
  );
}
