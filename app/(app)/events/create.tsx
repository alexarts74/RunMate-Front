import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { eventService } from "@/service/api/event";
import { CreateEventData } from "@/interface/Event";
import { UserSearch } from "@/components/UserSearch";
import User from "@/interface/User";
import * as Location from "expo-location";
import { validateCreateEventForm } from "@/constants/formValidation";
import { PremiumFeatureModal } from "@/components/common/PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

// Enum pour le niveau (correspondant a votre DB)
enum EventLevel {
  BEGINNER = 0,
  INTERMEDIATE = 1,
  ADVANCED = 2,
  EXPERT = 3,
}

interface LocationSuggestion {
  city: string;
  postcode: string;
  coordinates: [number, number];
  full_name: string;
  street?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function CreateEventScreen() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    start_date: new Date(),
    distance: "",
    max_participants: "",
    level: EventLevel.BEGINNER,
    cover_image: "",
    latitude: null as number | null,
    longitude: null as number | null,
    status: 0,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();
  const { colors, shadows } = useThemeColors();

  useEffect(() => {
    if (user?.user_type !== "organizer") {
      Alert.alert(
        "Acces restreint",
        "Seuls les organisateurs peuvent creer des evenements. Veuillez creer un compte organisateur pour acceder a cette fonctionnalite.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }
  }, [user]);

  useEffect(() => {
    if (user?.user_type === "organizer") {
      setShowPremiumModal(false);
      return;
    }
    if (!(user && "is_premium" in user && user.is_premium)) {
      setShowPremiumModal(true);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (geocodeTimerRef.current) {
        clearTimeout(geocodeTimerRef.current);
      }
      if (searchLocationTimerRef.current) {
        clearTimeout(searchLocationTimerRef.current);
      }
    };
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, cover_image: result.assets[0].uri });
    }
  };

  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchLocationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const geocodeLocation = useCallback((address: string) => {
    if (geocodeTimerRef.current) {
      clearTimeout(geocodeTimerRef.current);
    }

    geocodeTimerRef.current = setTimeout(async () => {
      try {
        const result = await Location.geocodeAsync(address);
        if (result.length > 0) {
          setFormData((prev) => ({
            ...prev,
            latitude: result[0].latitude,
            longitude: result[0].longitude,
          }));
        }
      } catch (error) {
        console.error("Erreur de geocodage:", error);
      }
    }, 1000);
  }, []);

  const searchLocation = useCallback((text: string) => {
    if (searchLocationTimerRef.current) {
      clearTimeout(searchLocationTimerRef.current);
    }

    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    searchLocationTimerRef.current = setTimeout(async () => {
      try {
        const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
          text
        )}&limit=15`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error("Erreur API:", response.status, response.statusText);
          const text = await response.text();
          console.error("Reponse brute:", text);
          setSuggestions([]);
          return;
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
          setSuggestions([]);
          return;
        }

        const formattedSuggestions = data.features
          .filter((feature: any) => {
            const props = feature.properties;
            return props && props.city;
          })
          .map((feature: any) => {
            const props = feature.properties;
            return {
              city: props.city,
              postcode: props.postcode,
              street: props.name,
              coordinates: feature.geometry.coordinates.reverse(),
              full_name: formatAddress(props),
            };
          });

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        if (error instanceof Error) {
          console.error("Message d'erreur:", error.message);
          console.error("Stack:", error.stack);
        }
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const formatAddress = (properties: any) => {
    const parts = [];

    if (properties.name) {
      parts.push(properties.name);
    }

    if (
      properties.housenumber &&
      !properties.name?.includes(properties.housenumber)
    ) {
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

  const handleUserSelect = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      location: suggestion.full_name,
      latitude: suggestion.coordinates[0],
      longitude: suggestion.coordinates[1],
    }));
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    const validationErrors = validateCreateEventForm(formData, setErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert(
        "Erreur de validation",
        "Veuillez corriger les erreurs avant de creer l'evenement"
      );
      return;
    }

    try {
      const eventData: CreateEventData = {
        ...formData,
        distance: parseFloat(formData.distance),
        max_participants: parseInt(formData.max_participants),
        invited_users: selectedUsers.map((user) => user.id),
      };
      await eventService.createEvent(eventData);
      router.back();
    } catch (error: any) {
      console.error("Erreur lors de la creation de l'evenement:", error);
      const errorMessage =
        error.message ||
        "Une erreur est survenue lors de la creation de l'evenement";
      Alert.alert("Erreur", errorMessage);
    }
  };

  const closeModal = () => {
    setShowPremiumModal(false);
    router.replace("/(tabs)/matches");
  };

  return (
    <WarmBackground>
      <SafeAreaView style={{ backgroundColor: colors.glass.heavy }} edges={['top']}>
        <View
          className="flex-row items-center px-6 py-4"
          style={{
            backgroundColor: colors.glass.heavy,
            ...shadows.sm,
          }}
        >
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="close" size={24} color={colors.primary.DEFAULT} />
          </Pressable>
          <Text
            className="text-xl font-nunito-extrabold flex-1"
            style={{ color: colors.text.primary }}
          >
            Creer un evenement
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={[styles.container, showPremiumModal && styles.blurContainer]}
      >
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
          <View className="space-y-5">
            {/* Image de couverture */}
            <View>
              <Pressable
                onPress={handleImagePick}
                className="h-48 rounded-2xl items-center justify-center mb-2"
                style={{
                  backgroundColor: colors.glass.light,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: colors.glass.border,
                  ...shadows.sm,
                }}
              >
                {formData.cover_image ? (
                  <Image
                    source={{ uri: formData.cover_image }}
                    className="w-full h-full rounded-2xl"
                  />
                ) : (
                  <View className="items-center">
                    <View
                      className="w-16 h-16 rounded-xl items-center justify-center mb-3"
                      style={{ backgroundColor: colors.primary.subtle }}
                    >
                      <Ionicons name="image-outline" size={32} color={colors.primary.DEFAULT} />
                    </View>
                    <Text className="font-nunito-medium text-base" style={{ color: colors.text.secondary }}>
                      Ajouter une photo
                    </Text>
                  </View>
                )}
              </Pressable>
              {errors.cover_image && (
                <Text className="text-sm font-nunito-medium mt-1" style={{ color: colors.error }}>
                  {errors.cover_image}
                </Text>
              )}
            </View>

            {/* Nom */}
            <GlassInput
              label="Nom de l'evenement"
              placeholder="Ex: Course matinale"
              value={formData.name}
              onChangeText={(text) =>
                setFormData({ ...formData, name: text })
              }
              error={errors.name}
            />

            {/* Description */}
            <GlassInput
              label="Description"
              placeholder="Decrivez votre evenement"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              error={errors.description}
            />

            {/* Date */}
            <View>
              <Text
                className="font-nunito-bold text-base mb-2"
                style={{ color: colors.text.primary }}
              >
                Date et heure
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="p-4 rounded-xl flex-row items-center justify-between"
                style={{
                  backgroundColor: colors.glass.light,
                  borderWidth: 1,
                  borderColor: errors.start_date ? colors.error : colors.glass.border,
                  ...shadows.sm,
                }}
              >
                <Text className="font-nunito-medium" style={{ color: colors.text.primary }}>
                  {formData.start_date.toLocaleString()}
                </Text>
                <Ionicons name="calendar" size={20} color={colors.primary.DEFAULT} />
              </Pressable>
              {errors.start_date && (
                <Text className="text-sm mt-1 font-nunito-medium" style={{ color: colors.error }}>
                  {errors.start_date}
                </Text>
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={formData.start_date}
                  mode="datetime"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setFormData({ ...formData, start_date: date });
                  }}
                />
              )}
            </View>

            {/* Niveau */}
            <View>
              <Text
                className="font-nunito-bold text-base mb-3"
                style={{ color: colors.text.primary }}
              >
                Niveau
              </Text>
              <View className="flex-row justify-between flex-wrap gap-3">
                {Object.values(EventLevel)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <Pressable
                      key={value}
                      onPress={() =>
                        setFormData({ ...formData, level: value as EventLevel })
                      }
                      className="flex-1 min-w-[45%] px-4 py-3.5 rounded-xl"
                      style={{
                        backgroundColor:
                          formData.level === value ? colors.primary.DEFAULT : colors.glass.light,
                        borderWidth: 1,
                        borderColor:
                          formData.level === value ? colors.primary.DEFAULT : colors.glass.border,
                        ...(formData.level === value ? shadows.md : shadows.sm),
                      }}
                    >
                      <Text
                        className="text-center font-nunito-bold text-sm"
                        style={{
                          color:
                            formData.level === value ? colors.text.inverse : colors.text.secondary,
                        }}
                      >
                        {EventLevel[value]}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            </View>

            {/* Lieu */}
            <View>
              <GlassInput
                label="Lieu"
                placeholder="Rechercher une adresse..."
                value={formData.location}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, location: text }));
                  searchLocation(text);
                }}
                error={errors.location}
              />

              {suggestions.length > 0 && (
                <View
                  className="mt-2 rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: colors.elevated,
                    borderWidth: 1,
                    borderColor: colors.glass.border,
                    ...shadows.md,
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectLocation(suggestion)}
                      className="p-4"
                      style={{
                        borderBottomWidth: index !== suggestions.length - 1 ? 1 : 0,
                        borderBottomColor: colors.glass.border,
                      }}
                    >
                      <Text className="font-nunito-medium" style={{ color: colors.text.primary }}>
                        {suggestion.full_name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Distance */}
            <GlassInput
              label="Distance (km)"
              placeholder="Ex: 5"
              keyboardType="numeric"
              value={formData.distance}
              onChangeText={(text) =>
                setFormData({ ...formData, distance: text })
              }
              error={errors.distance}
            />

            {/* Nombre max de participants */}
            <GlassInput
              label="Nombre maximum de participants"
              placeholder="Ex: 10"
              keyboardType="numeric"
              value={formData.max_participants}
              onChangeText={(text) =>
                setFormData({ ...formData, max_participants: text })
              }
              error={errors.max_participants}
            />

            <View>
              <Text
                className="font-nunito-bold text-base mb-2"
                style={{ color: colors.text.primary }}
              >
                Inviter des participants
              </Text>
              <UserSearch
                onSelectUser={handleUserSelect}
                selectedUsers={selectedUsers}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          className="px-6 py-4"
          style={{
            backgroundColor: colors.glass.heavy,
            borderTopWidth: 1,
            borderTopColor: colors.glass.border,
          }}
        >
          <GlassButton
            title="Creer l'evenement"
            onPress={handleSubmit}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>

      {/* Modal Premium */}
      <PremiumFeatureModal
        onUpgrade={() => {
          router.push("/premium");
          setShowPremiumModal(false);
        }}
        visible={showPremiumModal}
        onClose={closeModal}
        title="Fonctionnalite Premium"
        description="La creation d'evenements sera bientot disponible dans la version premium de l'application. Restez a l'ecoute pour plus d'informations !"
      />
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    opacity: 0.3,
  },
});
