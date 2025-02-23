import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/api/auth";
import * as Location from "expo-location";
import { SignUpFormStep0 } from "./SignUpFormStep0";
import { SignUpFormStep1 } from "./SignUpFormStep1";
import { SignUpFormStep2 } from "./SignUpFormStep2";
import { SignUpFormStep3 } from "./SignUpFormStep3";
import { runnerProfileService } from "@/service/api/runnerProfile";
import { signUpStorage } from "@/service/auth/storage";
import { RunnerProfile } from "@/interface/User";

export default function SignUpForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(0);
  const [runnerType, setRunnerType] = useState<"chill" | "perf">("chill");

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
    availability: "",
    objective: "",
    running_type: "",
    actual_pace: "",
    target_pace: "",
    usual_distance: "",
    weekly_mileage: "",
    running_frequency: [] as string[],
    preferred_time_of_day: [] as string[],
    training_days: [] as string[],
    competition_goals: "",
    social_preferences: [] as string[],
    post_run_activities: [] as string[],
  });

  // Au début du composant, ajouter un useEffect pour nettoyer les données au montage
  useEffect(() => {
    const clearOldData = async () => {
      await signUpStorage.clearSignUpData();
    };
    clearOldData();
  }, []);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedStep = await signUpStorage.getSignUpStep();
        const savedData = await signUpStorage.getSignUpData();

        // Ne charger les données que si on n'est pas au début de l'inscription
        if (savedStep && savedStep > 0 && savedData?.running_type) {
          setStep(savedStep);
          setRunnerType(savedData.running_type as "chill" | "perf");
          setFormData(savedData);
        } else {
          await signUpStorage.clearSignUpData();
        }
      } catch (error) {
        await signUpStorage.clearSignUpData();
      }
    };

    loadSavedData();
  }, []);

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

  const handleRunnerTypeSelect = async (type: "chill" | "perf") => {
    try {
      console.log("🎯 Selection du type:", type);
      setRunnerType(type);
      setFormData((prev) => ({
        ...prev,
        running_type: type,
      }));
      console.log("⏳ Avant changement de step");
      await handleStepChange(1);
      console.log("✅ Après changement de step");
    } catch (error) {
      console.error("❌ Erreur selection type:", error);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      // 1. Récupérer la localisation
      const locationData = await handleLocationUpdate();

      console.log("locationData", locationData);

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

      console.log("signUpResponse", signUpResponse);

      // 3. Se connecter
      await login(signUpResponse);

      // 4. Créer le profil coureur avec les bons champs
      const runnerProfileData: RunnerProfile = {
        actual_pace: runnerType === "perf" ? formData.actual_pace : "",
        target_pace: runnerType === "perf" ? formData.target_pace : "",
        weekly_mileage:
          runnerType === "perf"
            ? parseInt(formData.weekly_mileage) || null
            : null,
        competition_goals:
          runnerType === "perf" ? formData.competition_goals : "",
        training_days: runnerType === "perf" ? formData.training_days : [],
        usual_distance: formData.usual_distance.toString(),
        preferred_time_of_day: formData.preferred_time_of_day || [],
        running_type: runnerType,
        availability: [],
        objective: "",
        social_preferences:
          runnerType === "chill" ? formData.social_preferences : [],
        post_run_activities:
          runnerType === "chill" ? formData.post_run_activities : [],
        running_frequency:
          runnerType === "chill" ? formData.running_frequency : [],
      };

      const savedProfile = await runnerProfileService.save(runnerProfileData);

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
      {step === 0 ? (
        <SignUpFormStep0 onNext={handleRunnerTypeSelect} />
      ) : step === 1 ? (
        <SignUpFormStep1
          formData={formData}
          onNext={() => handleStepChange(2)}
          onBack={() => handleStepChange(0)}
          handleChange={handleChange}
        />
      ) : step === 2 ? (
        <SignUpFormStep2
          formData={formData}
          runnerType={runnerType}
          onBack={() => handleStepChange(1)}
          onNext={() => handleStepChange(3)}
          handleChange={handleChange}
        />
      ) : (
        <SignUpFormStep3
          formData={formData}
          runnerType={runnerType}
          onBack={() => handleStepChange(2)}
          onSubmit={handleFinalSubmit}
          handleChange={handleChange}
        />
      )}
    </>
  );
}
