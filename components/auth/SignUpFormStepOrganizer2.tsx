import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useThemeColors } from "@/constants/theme";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import PulseLoader from "@/components/ui/PulseLoader";

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
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationUsed, setLocationUsed] = useState(false);
  const searchLocationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors, shadows } = useThemeColors();

  // Log du formData recu en props
  useEffect(() => {
    console.log("[SignUpFormStepOrganizer2] formData recu:", {
      address: formData.address,
      city: formData.city,
      department: formData.department,
      postcode: formData.postcode,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });
  }, [formData]);

  // Verifier si les champs de localisation sont deja remplis
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
          "Permission refus\u00e9e",
          "L'acc\u00e8s \u00e0 la localisation est n\u00e9cessaire pour compl\u00e9ter votre profil."
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
        const addressParts = [];
        if (result.streetNumber) addressParts.push(result.streetNumber);
        if (result.street) addressParts.push(result.street);
        const fullAddress = addressParts.join(" ").trim();

        console.log("[handleUseCurrentLocation] Resultat de la geolocalisation:", {
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

        console.log("[handleUseCurrentLocation] Donnees a sauvegarder:", locationData);

        if (handleMultipleChanges) {
          console.log("[handleUseCurrentLocation] Utilisation de handleMultipleChanges");
          await handleMultipleChanges({
            address: fullAddress,
            organizer_city: locationData.city,
            organizer_department: locationData.department,
            organizer_postcode: locationData.postcode,
            organizer_latitude: locationData.latitude,
            organizer_longitude: locationData.longitude,
          });
        } else {
          console.log("[handleUseCurrentLocation] Fallback: utilisation de handleChange sequentiel");
          await handleChange("address", fullAddress);
          await handleChange("organizer_city", locationData.city);
          await handleChange("organizer_department", locationData.department);
          await handleChange("organizer_postcode", locationData.postcode);
          await handleChange("organizer_latitude", locationData.latitude);
          await handleChange("organizer_longitude", locationData.longitude);
        }

        console.log("[handleUseCurrentLocation] Tous les champs ont ete mis a jour");

        setLocationUsed(true);

        Alert.alert(
          "Localisation r\u00e9cup\u00e9r\u00e9e",
          "Vos informations de localisation ont \u00e9t\u00e9 remplies automatiquement.",
          [{ text: "OK" }]
        );
      } else {
        console.error("[handleUseCurrentLocation] Aucun resultat de geolocalisation");
        Alert.alert("Erreur", "Impossible de d\u00e9terminer votre adresse");
      }
    } catch (error) {
      console.error("Erreur de localisation:", error);
      Alert.alert("Erreur", "Impossible de r\u00e9cup\u00e9rer votre localisation");
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
      Alert.alert("Erreur", "Le d\u00e9partement est requis");
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
    <WarmBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
              {/* Header avec bouton retour */}
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <Pressable
                    onPress={onBack}
                    style={[
                      {
                        backgroundColor: colors.glass.light,
                        padding: 10,
                        borderRadius: 9999,
                        marginRight: 16,
                      },
                      shadows.sm,
                    ]}
                  >
                    <Ionicons name="arrow-back" size={20} color={colors.primary.DEFAULT} />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text.primary,
                        fontSize: 24,
                        fontFamily: "Nunito-ExtraBold",
                      }}
                    >
                      Contact et localisation
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    fontFamily: "Nunito-Medium",
                  }}
                >
                  Ajoutez vos informations de contact et votre localisation
                </Text>
              </View>

              {/* Site web */}
              <View style={{ marginBottom: 16 }}>
                <GlassInput
                  label="Site web (optionnel)"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChangeText={(value) => handleChange("website", value)}
                  keyboardType="url"
                  autoCapitalize="none"
                  icon={<Ionicons name="globe-outline" size={20} color={colors.primary.DEFAULT} />}
                />
              </View>

              {/* Telephone */}
              <View style={{ marginBottom: 16 }}>
                <GlassInput
                  label="T\u00e9l\u00e9phone (optionnel)"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.phone}
                  onChangeText={(value) => handleChange("phone", value)}
                  keyboardType="phone-pad"
                  icon={<Ionicons name="call-outline" size={20} color={colors.primary.DEFAULT} />}
                />
              </View>

              {/* Email */}
              <View style={{ marginBottom: 16 }}>
                <GlassInput
                  label="Email de contact (optionnel)"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChangeText={(value) => handleChange("organizer_email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Ionicons name="mail-outline" size={20} color={colors.primary.DEFAULT} />}
                />
              </View>

              {/* Localisation */}
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text
                    style={{
                      color: colors.text.secondary,
                      fontSize: 14,
                      fontFamily: "Nunito-SemiBold",
                    }}
                  >
                    Localisation *
                  </Text>
                  {!locationUsed && (
                    <Pressable
                      onPress={handleUseCurrentLocation}
                      disabled={loadingLocation}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: loadingLocation ? colors.surface : colors.primary.subtle,
                      }}
                    >
                      {loadingLocation ? (
                        <PulseLoader color={colors.text.tertiary} size={6} />
                      ) : (
                        <>
                          <Ionicons
                            name="location"
                            size={16}
                            color={colors.primary.DEFAULT}
                            style={{ marginRight: 4 }}
                          />
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: "Nunito-Bold",
                              color: colors.primary.DEFAULT,
                            }}
                          >
                            Utiliser ma position
                          </Text>
                        </>
                      )}
                    </Pressable>
                  )}
                  {locationUsed && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        backgroundColor: "rgba(124, 184, 138, 0.15)",
                        borderRadius: 12,
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={colors.success}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={{ color: colors.success, fontSize: 14, fontFamily: "Nunito-Bold" }}>
                        Localisation remplie
                      </Text>
                    </View>
                  )}
                </View>

                {/* Adresse */}
                <View style={{ marginBottom: 12 }}>
                  <GlassInput
                    label="Adresse (optionnel)"
                    placeholder="Rechercher une adresse..."
                    value={formData.address}
                    onChangeText={(text) => {
                      handleChange("address", text);
                      searchLocation(text);
                    }}
                    onFocus={() => {
                      if (formData.address) {
                        searchLocation(formData.address);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    icon={<Ionicons name="search-outline" size={20} color={colors.primary.DEFAULT} />}
                  />

                  {/* Suggestions d'adresses */}
                  {showSuggestions && suggestions.length > 0 && (
                    <View
                      style={[
                        {
                          marginTop: 8,
                          backgroundColor: colors.glass.heavy,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: colors.glass.border,
                          overflow: "hidden",
                        },
                        shadows.sm,
                      ]}
                    >
                      {suggestions.map((suggestion, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleSelectLocation(suggestion)}
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                            borderBottomColor: colors.glass.border,
                          }}
                        >
                          <Text style={{ color: colors.text.primary, fontSize: 14, fontFamily: "Nunito-Medium" }}>
                            {suggestion.full_name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                {/* Ville */}
                <View style={{ marginBottom: 12 }}>
                  <GlassInput
                    label="Ville *"
                    placeholder="Paris"
                    value={formData.city}
                    onChangeText={(value) => handleChange("organizer_city", value)}
                  />
                </View>

                {/* Departement */}
                <View style={{ marginBottom: 12 }}>
                  <GlassInput
                    label="D\u00e9partement *"
                    placeholder="75"
                    value={formData.department}
                    onChangeText={(value) => handleChange("organizer_department", value)}
                  />
                </View>

                {/* Code postal */}
                <View style={{ marginBottom: 12 }}>
                  <GlassInput
                    label="Code postal (optionnel)"
                    placeholder="75001"
                    value={formData.postcode}
                    onChangeText={(value) => handleChange("organizer_postcode", value)}
                    keyboardType="numeric"
                  />
                </View>

                {/* Pays */}
                <View>
                  <GlassInput
                    label="Pays (optionnel)"
                    placeholder="France"
                    value={formData.country || "France"}
                    onChangeText={(value) => handleChange("country", value)}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
            <GlassButton
              title="Terminer"
              onPress={handleSubmit}
              variant="primary"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WarmBackground>
  );
}
