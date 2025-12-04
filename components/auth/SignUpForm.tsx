import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/service/api/auth";
import * as Location from "expo-location";
import { SignUpFormStepUserType } from "./SignUpFormStepUserType";
import { SignUpFormStep0 } from "./SignUpFormStep0";
import { SignUpFormStep1 } from "./SignUpFormStep1";
import { SignUpFormStep2 } from "./SignUpFormStep2";
import { SignUpFormStep3 } from "./SignUpFormStep3";
import { SignUpFormStepOrganizer1 } from "./SignUpFormStepOrganizer1";
import { SignUpFormStepOrganizer2 } from "./SignUpFormStepOrganizer2";
import { runnerProfileService } from "@/service/api/runnerProfile";
import { organizerProfileService } from "@/service/api/organizerProfile";
import { signUpStorage } from "@/service/auth/storage";
import { RunnerProfile } from "@/interface/User";
import { useNotifications } from "@/context/NotificationContext";

export default function SignUpForm() {
  const { login } = useAuth();
  const { registerForPushNotifications } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(-1);
  const [userType, setUserType] = useState<"runner" | "organizer">("runner");
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
    objective: [] as string[],
    running_type: "",
    actual_pace: "",
    target_pace: "",
    usual_distance: "",
    weekly_mileage: "",
    running_frequency: [] as string[],
    preferred_time_of_day: [] as string[],
    training_days: [] as string[],
    competition_goals: [] as string[],
    social_preferences: [] as string[],
    post_run_activities: [] as string[],
    // Champs pour le profil organisateur
    organization_name: "",
    organization_type: "",
    description: "",
    website: "",
    phone: "",
    organizer_email: "",
    address: "",
    organizer_city: "",
    organizer_department: "",
    organizer_postcode: "",
    country: "France",
    organizer_latitude: null as number | null,
    organizer_longitude: null as number | null,
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
        if (savedStep && savedStep > -1 && savedData) {
          setStep(savedStep);
          if (savedData.user_type) {
            setUserType(savedData.user_type as "runner" | "organizer");
          }
          if (savedData.running_type) {
          setRunnerType(savedData.running_type as "chill" | "perf");
          }
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
    console.log("🔄 [SignUpForm handleChange] Appelé avec:", { name, value, type: typeof value });
    
    const newFormData: any = {
      ...formData,
      [name]: value,
    };

    console.log("🔄 [SignUpForm handleChange] Nouveau formData:", {
      [name]: newFormData[name],
      organizer_city: newFormData.organizer_city,
      organizer_department: newFormData.organizer_department,
      organizer_postcode: newFormData.organizer_postcode,
      organizer_latitude: newFormData.organizer_latitude,
      organizer_longitude: newFormData.organizer_longitude,
    });

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
        return {
          city: "Sallanches",
          department: "Haute-Savoie",
          postcode: "74700",
          latitude: 45.934,
          longitude: 6.63,
        };
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

  const handleUserTypeSelect = async (type: "runner" | "organizer") => {
    try {
      setUserType(type);
      const newFormData = {
        ...formData,
        user_type: type,
      };
      setFormData(newFormData);
      await signUpStorage.saveSignUpData(newFormData);
      if (type === "organizer") {
        // Pour les organisateurs, on passe à l'étape 1 (informations de base utilisateur)
        await handleStepChange(1);
      } else {
        // Pour les runners, on va à l'étape 0 (choix du type de runner)
        await handleStepChange(0);
      }
    } catch (error) {
      console.error("❌ Erreur selection type utilisateur:", error);
    }
  };

  const handleRunnerTypeSelect = async (type: "chill" | "perf") => {
    try {
      setRunnerType(type);
      setFormData((prev) => ({
        ...prev,
        running_type: type,
      }));
      await handleStepChange(1);
    } catch (error) {
      console.error("❌ Erreur selection type:", error);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setError("");
      setLoading(true);

      // 1. Récupérer la localisation (pour les runners ou si pas de localisation organisateur)
      let locationData;
      if (userType === "organizer" && formData.organizer_city && formData.organizer_department) {
        // Utiliser les données du formulaire organisateur
        locationData = {
          city: formData.organizer_city,
          department: formData.organizer_department,
          postcode: formData.organizer_postcode || "",
          latitude: formData.organizer_latitude || 0,
          longitude: formData.organizer_longitude || 0,
        };
      } else {
        // Récupérer la localisation automatiquement
        locationData = await handleLocationUpdate();
      }

      // 2. Créer le compte utilisateur
      const signUpData: any = {
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
        user_type: userType,
      };

      // Ajouter running_type uniquement pour les runners
      if (userType === "runner") {
        signUpData.running_type = runnerType;
      }

      const signUpResponse = await authService.signUp(signUpData);

      // 3. Se connecter
      await login(signUpResponse);

      // 4. Créer le profil selon le type d'utilisateur
      if (userType === "runner") {
        // Créer le profil coureur avec les bons champs
      const runnerProfileData: RunnerProfile = {
        actual_pace: runnerType === "perf" ? formData.actual_pace : "",
        target_pace: runnerType === "perf" ? formData.target_pace : "",
        weekly_mileage:
          runnerType === "perf"
            ? parseInt(formData.weekly_mileage) || null
            : null,
        competition_goals:
          runnerType === "perf" ? formData.competition_goals : [],
        training_days: runnerType === "perf" ? formData.training_days : [],
        usual_distance:
          runnerType === "chill" ? formData.usual_distance.toString() : null,
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
      } else if (userType === "organizer") {
        // Créer le profil organisateur
        const organizerProfileData = {
          organization_name: formData.organization_name,
          organization_type: formData.organization_type as "association" | "club_sportif" | "entreprise" | "collectif" | "autre",
          description: formData.description || undefined,
          website: formData.website || undefined,
          phone: formData.phone || undefined,
          email: formData.organizer_email || undefined,
          address: formData.address || undefined,
          city: formData.organizer_city,
          department: formData.organizer_department,
          postcode: formData.organizer_postcode || undefined,
          country: formData.country || "France",
        };

        try {
          console.log("🏢 [SignUpForm] Création profil organisateur avec:", organizerProfileData);
          const createdProfile = await organizerProfileService.createProfile(organizerProfileData);
          console.log("🏢 [SignUpForm] Profil organisateur créé:", createdProfile);
        } catch (error) {
          console.error("❌ [SignUpForm] Erreur lors de la création du profil organisateur:", error);
          // On continue même si le profil n'a pas pu être créé, l'utilisateur pourra le faire plus tard
        }
      }

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

  // Fonction pour gérer le changement de valeur avec support des types null
  const handleChangeWithType = async (name: string, value: any) => {
    await handleChange(name, value);
  };

  // Fonction pour mettre à jour plusieurs champs en une seule fois
  const handleMultipleChanges = async (updates: { [key: string]: any }) => {
    console.log("🔄 [SignUpForm handleMultipleChanges] Appelé avec:", updates);
    
    const newFormData: any = {
      ...formData,
      ...updates,
    };

    console.log("🔄 [SignUpForm handleMultipleChanges] Nouveau formData:", {
      organizer_city: newFormData.organizer_city,
      organizer_department: newFormData.organizer_department,
      organizer_postcode: newFormData.organizer_postcode,
      organizer_latitude: newFormData.organizer_latitude,
      organizer_longitude: newFormData.organizer_longitude,
      address: newFormData.address,
    });

    setFormData(newFormData);
    await signUpStorage.saveSignUpData(newFormData);
  };

  return (
    <>
      {step === -1 ? (
        <SignUpFormStepUserType onNext={handleUserTypeSelect} />
      ) : step === 0 && userType === "runner" ? (
        <SignUpFormStep0 onNext={handleRunnerTypeSelect} />
      ) : step === 1 ? (
        <SignUpFormStep1
          formData={formData}
          onNext={() => {
            if (userType === "organizer") {
              handleStepChange(2);
            } else {
              handleStepChange(2);
            }
          }}
          onBack={() => {
            if (userType === "runner") {
              handleStepChange(0);
            } else {
              handleStepChange(-1);
            }
          }}
          handleChange={handleChange}
        />
      ) : step === 2 && userType === "organizer" ? (
        <SignUpFormStepOrganizer1
          formData={{
            organization_name: formData.organization_name,
            organization_type: formData.organization_type,
            description: formData.description,
          }}
          onNext={() => handleStepChange(3)}
          onBack={() => handleStepChange(1)}
          handleChange={handleChange}
        />
      ) : step === 3 && userType === "organizer" ? (
        <SignUpFormStepOrganizer2
          formData={{
            website: formData.website,
            phone: formData.phone,
            email: formData.organizer_email,
            address: formData.address,
            city: formData.organizer_city,
            department: formData.organizer_department,
            postcode: formData.organizer_postcode,
            country: formData.country,
            latitude: formData.organizer_latitude,
            longitude: formData.organizer_longitude,
          }}
          onNext={handleFinalSubmit}
          onBack={() => handleStepChange(2)}
          handleChange={handleChangeWithType}
          handleMultipleChanges={handleMultipleChanges}
        />
      ) : step === 2 && userType === "runner" ? (
        <SignUpFormStep2
          formData={formData}
          runnerType={runnerType}
          onBack={() => handleStepChange(1)}
          onNext={() => handleStepChange(3)}
          handleChange={handleChange}
        />
      ) : step === 3 && userType === "runner" ? (
        <SignUpFormStep3
          formData={formData}
          runnerType={runnerType}
          onBack={() => handleStepChange(2)}
          onSubmit={handleFinalSubmit}
          handleChange={handleChange}
        />
      ) : null}
    </>
  );
}
