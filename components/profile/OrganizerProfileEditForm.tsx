import React, { useState, useEffect } from "react";
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
import { organizerProfileService, CreateOrganizerProfileData } from "@/service/api/organizerProfile";
import { OrganizerProfile } from "@/interface/User";

const ACCENT = "#F97316";

type OrganizerProfileEditFormProps = {
  setIsEditing: (value: boolean) => void;
};

const organizationTypeOptions = [
  { key: "association", value: "Association" },
  { key: "club_sportif", value: "Club sportif" },
  { key: "entreprise", value: "Entreprise" },
  { key: "collectif", value: "Collectif" },
  { key: "autre", value: "Autre" },
];

export function OrganizerProfileEditForm({ setIsEditing }: OrganizerProfileEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<OrganizerProfile | null>(null);
  const [formData, setFormData] = useState<CreateOrganizerProfileData>({
    organization_name: "",
    organization_type: "association",
    description: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    department: "",
    postcode: "",
    country: "France",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await organizerProfileService.getProfile();
        if (profile) {
          setExistingProfile(profile);
          setFormData({
            organization_name: profile.organization_name || "",
            organization_type: profile.organization_type || "association",
            description: profile.description || "",
            website: profile.website || "",
            phone: profile.phone || "",
            email: profile.email || "",
            address: profile.address || "",
            city: profile.city || "",
            department: profile.department || "",
            postcode: profile.postcode || "",
            country: profile.country || "France",
            latitude: profile.latitude || null,
            longitude: profile.longitude || null,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (name: keyof CreateOrganizerProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.organization_name.trim()) {
      setError("Le nom de l'organisation est requis");
      return;
    }

    if (!formData.city.trim()) {
      setError("La ville est requise");
      return;
    }

    if (!formData.department.trim()) {
      setError("Le département est requis");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (existingProfile) {
        await organizerProfileService.updateProfile(formData);
      } else {
        await organizerProfileService.createProfile(formData);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.message || "Une erreur est survenue lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View className="flex-1 bg-fond items-center justify-center">
        <ActivityIndicator color={ACCENT} size="large" />
        <Text className="text-gray-600 font-nunito-medium mt-4">Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-fond px-6 py-6 pt-6"
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <Text className="text-2xl font-nunito-extrabold mb-6 text-gray-900">
          {existingProfile ? "Modifier mon organisation" : "Créer mon organisation"}
        </Text>

        <View className="space-y-4">
          {/* Nom de l'organisation */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Nom de l'organisation *
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "organization_name"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="Nom de votre organisation"
              placeholderTextColor="#9CA3AF"
              value={formData.organization_name}
              onChangeText={(value) => handleChange("organization_name", value)}
              onFocus={() => setFocusedInput("organization_name")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "organization_name" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "organization_name" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Type d'organisation */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Type d'organisation *
            </Text>
            <SelectList
              setSelected={(val: string) => handleChange("organization_type", val as CreateOrganizerProfileData["organization_type"])}
              data={organizationTypeOptions}
              save="key"
              defaultOption={organizationTypeOptions.find(opt => opt.key === formData.organization_type)}
              placeholder="Sélectionnez le type"
              boxStyles={{
                borderWidth: 1,
                borderColor: focusedInput === "organization_type" ? ACCENT : "#E5E7EB",
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
              inputStyles={{ color: "#111827", fontFamily: "Nunito-Medium" }}
              dropdownTextStyles={{ color: "#111827", fontFamily: "Nunito-Medium" }}
              search={false}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Description
            </Text>
            <TextInput
              className={`w-full border rounded-2xl p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "description" ? "border-primary" : "border-gray-200"
              }`}
              placeholder="Décrivez votre organisation..."
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(value) => handleChange("description", value)}
              onFocus={() => setFocusedInput("description")}
              onBlur={() => setFocusedInput(null)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                shadowColor: focusedInput === "description" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: focusedInput === "description" ? 0.1 : 0.05,
                shadowRadius: 4,
                elevation: 2,
                minHeight: 100,
              }}
            />
          </View>

          {/* Site web */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Site web
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "website"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="https://www.example.com"
              placeholderTextColor="#9CA3AF"
              value={formData.website}
              onChangeText={(value) => handleChange("website", value)}
              onFocus={() => setFocusedInput("website")}
              onBlur={() => setFocusedInput(null)}
              keyboardType="url"
              autoCapitalize="none"
              style={{
                shadowColor: focusedInput === "website" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "website" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Email de contact */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Email de contact
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "email"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="contact@example.com"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                shadowColor: focusedInput === "email" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "email" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Téléphone */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Téléphone
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "phone"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="01 23 45 67 89"
              placeholderTextColor="#9CA3AF"
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              onFocus={() => setFocusedInput("phone")}
              onBlur={() => setFocusedInput(null)}
              keyboardType="phone-pad"
              style={{
                shadowColor: focusedInput === "phone" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "phone" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Séparateur Localisation */}
          <View className="pt-4">
            <Text className="text-lg font-nunito-bold text-gray-900 mb-2">
              Localisation
            </Text>
            <View className="h-px bg-gray-200 mb-4" />
          </View>

          {/* Adresse */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Adresse
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "address"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="123 rue Example"
              placeholderTextColor="#9CA3AF"
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              onFocus={() => setFocusedInput("address")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "address" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "address" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Code postal */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Code postal
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "postcode"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="75001"
              placeholderTextColor="#9CA3AF"
              value={formData.postcode}
              onChangeText={(value) => handleChange("postcode", value)}
              onFocus={() => setFocusedInput("postcode")}
              onBlur={() => setFocusedInput(null)}
              keyboardType="numeric"
              style={{
                shadowColor: focusedInput === "postcode" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "postcode" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Ville */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Ville *
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "city"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="Paris"
              placeholderTextColor="#9CA3AF"
              value={formData.city}
              onChangeText={(value) => handleChange("city", value)}
              onFocus={() => setFocusedInput("city")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "city" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "city" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Département */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Département *
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "department"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="Paris"
              placeholderTextColor="#9CA3AF"
              value={formData.department}
              onChangeText={(value) => handleChange("department", value)}
              onFocus={() => setFocusedInput("department")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "department" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "department" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>

          {/* Pays */}
          <View>
            <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
              Pays
            </Text>
            <TextInput
              className={`w-full border rounded-full p-4 bg-white text-gray-900 font-nunito-medium ${
                focusedInput === "country"
                  ? "border-primary"
                  : "border-gray-200"
              }`}
              placeholder="France"
              placeholderTextColor="#9CA3AF"
              value={formData.country}
              onChangeText={(value) => handleChange("country", value)}
              onFocus={() => setFocusedInput("country")}
              onBlur={() => setFocusedInput(null)}
              style={{
                shadowColor: focusedInput === "country" ? ACCENT : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: focusedInput === "country" ? 0.1 : 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </View>
        </View>

        {error ? (
          <Text className="text-red-500 text-center mt-4 font-nunito-medium">{error}</Text>
        ) : null}

        <View className="space-y-3 mt-6">
          <Pressable
            className="bg-primary py-4 rounded-full items-center"
            style={{
              shadowColor: ACCENT,
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
              <Text className="text-white font-nunito-bold">Enregistrer</Text>
            )}
          </Pressable>
          <Pressable
            className="bg-white border-2 border-gray-300 py-4 rounded-full items-center"
            onPress={() => setIsEditing(false)}
          >
            <Text className="text-gray-700 font-nunito-bold">Annuler</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
