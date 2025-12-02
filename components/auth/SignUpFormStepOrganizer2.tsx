import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "@/components/ui/ActionButton";
import * as Location from "expo-location";

interface LocationSuggestion {
  city: string;
  postcode: string;
  coordinates: [number, number];
  full_name: string;
  street?: string;
}

interface SignUpFormStepOrganizer2Props {
  formData: {
    website: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    department: string;
    postcode: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
  };
  onNext: () => void;
  handleChange: (name: string, value: string | number | null) => void;
  handleMultipleChanges?: (updates: { [key: string]: any }) => Promise<void>;
  onBack: () => void;
}

export function SignUpFormStepOrganizer2({
  formData,
  onNext,
  handleChange,
  handleMultipleChanges,
  onBack,
}: SignUpFormStepOrganizer2Props) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationUsed, setLocationUsed] = useState(false);
  const searchLocationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Log du formData reçu en props
  useEffect(() => {
    console.log("📋 [SignUpFormStepOrganizer2] formData reçu:", {
      address: formData.address,
      city: formData.city,
      department: formData.department,
      postcode: formData.postcode,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });
  }, [formData]);

  // Vérifier si les champs de localisation sont déjà remplis
  useEffect(() => {
    if (formData.city && formData.department) {
      setLocationUsed(true);
    }
  }, [formData.city, formData.department]);

  const searchLocation = useCallback((text: string) => {
    if (searchLocationTimerRef.current) {
      clearTimeout(searchLocationTimerRef.current);
    }

    if (!text || text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    searchLocationTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(text)}&limit=5`
        );
        const data = await response.json();

        const formattedSuggestions: LocationSuggestion[] = data.features.map((feature: any) => {
          const props = feature.properties;
          return {
            city: props.city || "",
            postcode: props.postcode || "",
            coordinates: feature.geometry.coordinates.reverse() as [number, number],
            full_name: formatAddress(props),
            street: props.name,
          };
        });

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const formatAddress = (properties: any) => {
    const parts = [];

    if (properties.name) {
      parts.push(properties.name);
    }

    if (properties.housenumber && !properties.name?.includes(properties.housenumber)) {
      parts.push(properties.housenumber);
    }

    if (properties.street && !properties.name?.includes(properties.street)) {
      parts.push(properties.street);
    }

    if (properties.city) {
      if (properties.postcode) {
        if (!properties.name?.includes(properties.city)) {
          parts.push(`${properties.city} (${properties.postcode})`);
        } else {
          parts.push(`(${properties.postcode})`);
        }
      } else {
        if (!properties.name?.includes(properties.city)) {
          parts.push(properties.city);
        }
      }
    }

    return parts.filter(Boolean).join(", ");
  };

  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    handleChange("address", suggestion.street || "");
    handleChange("organizer_city", suggestion.city);
    handleChange("organizer_postcode", suggestion.postcode);
    handleChange("organizer_latitude", suggestion.coordinates[0]);
    handleChange("organizer_longitude", suggestion.coordinates[1]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour compléter votre profil."
        );
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [result] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (result) {
        // Remplir tous les champs de localisation avec les bons noms de champs
        const addressParts = [];
        if (result.streetNumber) addressParts.push(result.streetNumber);
        if (result.street) addressParts.push(result.street);
        const fullAddress = addressParts.join(" ").trim();

        console.log("📍 [handleUseCurrentLocation] Résultat de la géolocalisation:", {
          result,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          addressParts,
          fullAddress,
        });

        const locationData = {
          address: fullAddress,
          city: result.city || "",
          department: result.region || "",
          postcode: result.postalCode || "",
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        console.log("📍 [handleUseCurrentLocation] Données à sauvegarder:", locationData);

        // Mettre à jour tous les champs en une seule fois pour éviter les problèmes de state asynchrone
        if (handleMultipleChanges) {
          console.log("📍 [handleUseCurrentLocation] Utilisation de handleMultipleChanges");
          await handleMultipleChanges({
            address: fullAddress,
            organizer_city: locationData.city,
            organizer_department: locationData.department,
            organizer_postcode: locationData.postcode,
            organizer_latitude: locationData.latitude,
            organizer_longitude: locationData.longitude,
          });
        } else {
          // Fallback si handleMultipleChanges n'est pas disponible
          console.log("📍 [handleUseCurrentLocation] Fallback: utilisation de handleChange séquentiel");
          await handleChange("address", fullAddress);
          await handleChange("organizer_city", locationData.city);
          await handleChange("organizer_department", locationData.department);
          await handleChange("organizer_postcode", locationData.postcode);
          await handleChange("organizer_latitude", locationData.latitude);
          await handleChange("organizer_longitude", locationData.longitude);
        }

        console.log("📍 [handleUseCurrentLocation] Tous les champs ont été mis à jour");

        // Marquer que la localisation a été utilisée
        setLocationUsed(true);

        // Afficher un message de succès
        Alert.alert(
          "Localisation récupérée",
          "Vos informations de localisation ont été remplies automatiquement.",
          [{ text: "OK" }]
        );
      } else {
        console.error("📍 [handleUseCurrentLocation] Aucun résultat de géolocalisation");
        Alert.alert("Erreur", "Impossible de déterminer votre adresse");
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erreur", "Impossible de récupérer votre localisation");
    } finally {
      setLoadingLocation(false);
    }
  };

  const validateForm = () => {
    if (!formData.city.trim()) {
      Alert.alert("Erreur", "La ville est requise");
      return false;
    }
    if (!formData.department.trim()) {
      Alert.alert("Erreur", "Le département est requis");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-fond">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 py-6">
            {/* Header avec bouton retour */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <Pressable
                  onPress={onBack}
                  className="bg-white p-2.5 rounded-full active:opacity-80 mr-4"
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
                  <Text className="text-gray-900 text-2xl font-nunito-extrabold">
                    Contact et localisation
                  </Text>
                </View>
              </View>
              <Text className="text-gray-600 text-base font-nunito-medium">
                Ajoutez vos informations de contact et votre localisation
              </Text>
            </View>

            {/* Site web */}
            <View className="mb-4">
              <Text className="text-gray-900 text-base font-nunito-bold mb-2">
                Site web (optionnel)
              </Text>
              <View
                className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                  focusedInput === "website" ? "border-primary" : "border-gray-200"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <TextInput
                  value={formData.website}
                  onChangeText={(value) => handleChange("website", value)}
                  onFocus={() => setFocusedInput("website")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="https://example.com"
                  placeholderTextColor="#9CA3AF"
                  className="text-gray-900 text-base font-nunito-medium"
                  style={{ color: "#111827" }}
                  selectionColor="#FF6B4A"
                  editable={true}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Téléphone */}
            <View className="mb-4">
              <Text className="text-gray-900 text-base font-nunito-bold mb-2">
                Téléphone (optionnel)
              </Text>
              <View
                className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                  focusedInput === "phone" ? "border-primary" : "border-gray-200"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <TextInput
                  value={formData.phone}
                  onChangeText={(value) => handleChange("phone", value)}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="+33 1 23 45 67 89"
                  placeholderTextColor="#9CA3AF"
                  className="text-gray-900 text-base font-nunito-medium"
                  style={{ color: "#111827" }}
                  selectionColor="#FF6B4A"
                  editable={true}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-900 text-base font-nunito-bold mb-2">
                Email de contact (optionnel)
              </Text>
              <View
                className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                  focusedInput === "email" ? "border-primary" : "border-gray-200"
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleChange("organizer_email", value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="contact@example.com"
                  placeholderTextColor="#9CA3AF"
                  className="text-gray-900 text-base font-nunito-medium"
                  style={{ color: "#111827" }}
                  selectionColor="#FF6B4A"
                  editable={true}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Localisation */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-900 text-base font-nunito-bold">
                  Localisation *
                </Text>
                {!locationUsed && (
                  <Pressable
                    onPress={handleUseCurrentLocation}
                    disabled={loadingLocation}
                    className={`flex-row items-center px-3 py-2 rounded-xl ${
                      loadingLocation ? "bg-gray-200" : "bg-primary/10"
                    }`}
                  >
                    <Ionicons
                      name="location"
                      size={16}
                      color={loadingLocation ? "#9CA3AF" : "#FF6B4A"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      className={`text-sm font-nunito-bold ${
                        loadingLocation ? "text-gray-500" : "text-primary"
                      }`}
                    >
                      {loadingLocation ? "Chargement..." : "Utiliser ma position"}
                    </Text>
                  </Pressable>
                )}
                {locationUsed && (
                  <View className="flex-row items-center px-3 py-2 bg-green-100 rounded-xl">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10B981"
                      style={{ marginRight: 4 }}
                    />
                    <Text className="text-green-700 text-sm font-nunito-bold">
                      Localisation remplie
                    </Text>
                  </View>
                )}
              </View>

              {/* Adresse */}
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-nunito-medium mb-2">
                  Adresse (optionnel)
                </Text>
                <View
                  className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                    focusedInput === "address" ? "border-primary" : "border-gray-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TextInput
                    value={formData.address}
                    onChangeText={(text) => {
                      handleChange("address", text);
                      searchLocation(text);
                    }}
                    onFocus={() => {
                      setFocusedInput("address");
                      if (formData.address) {
                        searchLocation(formData.address);
                      }
                    }}
                    onBlur={() => {
                      setFocusedInput(null);
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder="Rechercher une adresse..."
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 text-base font-nunito-medium"
                    style={{ color: "#111827" }}
                    selectionColor="#FF6B4A"
                    editable={true}
                  />
                </View>

                {/* Suggestions d'adresses */}
                {showSuggestions && suggestions.length > 0 && (
                  <View className="mt-2 bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleSelectLocation(suggestion)}
                        className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                      >
                        <Text className="text-gray-900 text-sm font-nunito-medium">
                          {suggestion.full_name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Ville */}
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-nunito-medium mb-2">
                  Ville *
                </Text>
                <View
                  className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                    focusedInput === "city" ? "border-primary" : "border-gray-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TextInput
                    value={formData.city}
                    onChangeText={(value) => handleChange("organizer_city", value)}
                    onFocus={() => setFocusedInput("city")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Paris"
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 text-base font-nunito-medium"
                    style={{ color: "#111827" }}
                    selectionColor="#FF6B4A"
                    editable={true}
                  />
                </View>
              </View>

              {/* Département */}
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-nunito-medium mb-2">
                  Département *
                </Text>
                <View
                  className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                    focusedInput === "department" ? "border-primary" : "border-gray-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TextInput
                    value={formData.department}
                    onChangeText={(value) => handleChange("organizer_department", value)}
                    onFocus={() => setFocusedInput("department")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="75"
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 text-base font-nunito-medium"
                    style={{ color: "#111827" }}
                    selectionColor="#FF6B4A"
                    editable={true}
                  />
                </View>
              </View>

              {/* Code postal */}
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-nunito-medium mb-2">
                  Code postal (optionnel)
                </Text>
                <View
                  className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                    focusedInput === "postcode" ? "border-primary" : "border-gray-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TextInput
                    value={formData.postcode}
                    onChangeText={(value) => handleChange("organizer_postcode", value)}
                    onFocus={() => setFocusedInput("postcode")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="75001"
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 text-base font-nunito-medium"
                    style={{ color: "#111827" }}
                    selectionColor="#FF6B4A"
                    editable={true}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Pays */}
              <View>
                <Text className="text-gray-700 text-sm font-nunito-medium mb-2">
                  Pays (optionnel)
                </Text>
                <View
                  className={`bg-white rounded-2xl px-4 py-4 border-2 ${
                    focusedInput === "country" ? "border-primary" : "border-gray-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TextInput
                    value={formData.country || "France"}
                    onChangeText={(value) => handleChange("country", value)}
                    onFocus={() => setFocusedInput("country")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="France"
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 text-base font-nunito-medium"
                    style={{ color: "#111827" }}
                    selectionColor="#FF6B4A"
                    editable={true}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <ActionButton
            onPress={handleSubmit}
            text="Terminer"
            className="w-full"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

