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

// Enum pour le niveau (correspondant à votre DB)
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

  // Vérifier si l'utilisateur est premium dès le chargement
  useEffect(() => {
    if (!(user && "is_premium" in user && user.is_premium)) {
      setShowPremiumModal(true);
    }
  }, [user]);

  // Nettoyer les timers au démontage
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
        console.error("Erreur de géocodage:", error);
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

        // Vérifier si la réponse est ok
        if (!response.ok) {
          console.error("Erreur API:", response.status, response.statusText);
          const text = await response.text();
          console.error("Réponse brute:", text);
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
              coordinates: feature.geometry.coordinates.reverse(), // [lat, lng]
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
        "Veuillez corriger les erreurs avant de créer l'événement"
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
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de l'événement"
      );
    }
  };

  const closeModal = () => {
    setShowPremiumModal(false);
    router.replace("/(tabs)/matches");
  };

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-white" edges={['top']}>
        <View
          className="flex-row items-center px-6 py-4 bg-white border-b border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="close" size={24} color="#FF6B4A" />
          </Pressable>
          <Text className="text-gray-900 text-xl font-kanit-bold flex-1">
            Créer un événement
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={[styles.container, showPremiumModal && styles.blurContainer]}
      >
        <ScrollView className="flex-1 px-6 py-4 bg-fond" showsVerticalScrollIndicator={false}>
          <View className="space-y-5">
            {/* Image de couverture */}
            <View>
              <Pressable
                onPress={handleImagePick}
                className="h-48 bg-white rounded-2xl items-center justify-center mb-2 border-2 border-dashed border-gray-300"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                {formData.cover_image ? (
                  <Image
                    source={{ uri: formData.cover_image }}
                    className="w-full h-full rounded-2xl"
                  />
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-xl bg-tertiary items-center justify-center mb-3">
                      <Ionicons name="image-outline" size={32} color="#FF6B4A" />
                    </View>
                    <Text className="text-gray-600 font-kanit-medium text-base">
                      Ajouter une photo
                    </Text>
                  </View>
                )}
              </Pressable>
              {errors.cover_image && (
                <Text className="text-red-500 text-sm font-kanit-medium mt-1">
                  {errors.cover_image}
                </Text>
              )}
            </View>

            {/* Nom */}
            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">
                Nom de l'événement
              </Text>
              <TextInput
                className={`bg-white text-gray-900 p-4 rounded-xl border-2 font-kanit-medium ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Ex: Course matinale"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                style={{
                  shadowColor: errors.name ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1 font-kanit-medium">{errors.name}</Text>
              )}
            </View>

            {/* Description */}
            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">Description</Text>
              <TextInput
                className={`bg-white text-gray-900 p-4 rounded-xl border-2 font-kanit-medium ${
                  errors.description ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Décrivez votre événement"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                style={{
                  shadowColor: errors.description ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.description && (
                <Text className="text-red-500 text-sm mt-1 font-kanit-medium">
                  {errors.description}
                </Text>
              )}
            </View>

            {/* Date */}
            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">Date et heure</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className={`bg-white p-4 rounded-xl border-2 flex-row items-center justify-between ${
                  errors.start_date ? "border-red-500" : "border-gray-200"
                }`}
                style={{
                  shadowColor: errors.start_date ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Text className="text-gray-900 font-kanit-medium">
                  {formData.start_date.toLocaleString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#FF6B4A" />
              </Pressable>
              {errors.start_date && (
                <Text className="text-red-500 text-sm mt-1 font-kanit-medium">
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
              <Text className="text-gray-900 font-kanit-bold text-base mb-3">Niveau</Text>
              <View className="flex-row justify-between flex-wrap gap-3">
                {Object.values(EventLevel)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <Pressable
                      key={value}
                      onPress={() =>
                        setFormData({ ...formData, level: value as EventLevel })
                      }
                      className={`flex-1 min-w-[45%] px-4 py-3.5 rounded-xl border-2 ${
                        formData.level === value
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                      style={{
                        shadowColor: formData.level === value ? "#FF6B4A" : "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: formData.level === value ? 0.2 : 0.05,
                        shadowRadius: 4,
                        elevation: formData.level === value ? 3 : 1,
                      }}
                    >
                      <Text
                        className={`text-center font-kanit-bold text-sm ${
                          formData.level === value ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {EventLevel[value]}
                      </Text>
                    </Pressable>
                  ))}
              </View>
            </View>

            {/* Lieu */}
            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">Lieu</Text>
              <TextInput
                className={`bg-white text-gray-900 p-4 rounded-xl border-2 font-kanit-medium ${
                  errors.location ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Rechercher une adresse..."
                placeholderTextColor="#9CA3AF"
                value={formData.location}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, location: text }));
                  searchLocation(text);
                }}
                style={{
                  shadowColor: errors.location ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.location && (
                <Text className="text-red-500 text-sm mt-1 font-kanit-medium">
                  {errors.location}
                </Text>
              )}

              {suggestions.length > 0 && (
                <View className="bg-white mt-2 rounded-xl overflow-hidden border-2 border-gray-200"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectLocation(suggestion)}
                      className="p-4 border-b border-gray-100"
                      android_ripple={{ color: "rgba(255, 107, 74, 0.1)" }}
                    >
                      <Text className="text-gray-900 font-kanit-medium">{suggestion.full_name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Distance */}
            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">Distance (km)</Text>
              <TextInput
                className={`bg-white text-gray-900 p-4 rounded-xl border-2 font-kanit-medium ${
                  errors.distance ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Ex: 5"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.distance}
                onChangeText={(text) =>
                  setFormData({ ...formData, distance: text })
                }
                style={{
                  shadowColor: errors.distance ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.distance && (
                <Text className="text-red-500 text-sm mt-1 font-kanit-medium">
                  {errors.distance}
                </Text>
              )}
            </View>

            {/* Nombre max de participants */}
            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">
                Nombre maximum de participants
              </Text>
              <TextInput
                className={`bg-white text-gray-900 p-4 rounded-xl border-2 font-kanit-medium ${
                  errors.max_participants ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Ex: 10"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formData.max_participants}
                onChangeText={(text) =>
                  setFormData({ ...formData, max_participants: text })
                }
                style={{
                  shadowColor: errors.max_participants ? "#EF4444" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              />
              {errors.max_participants && (
                <Text className="text-red-500 text-sm mt-1 font-kanit-medium">
                  {errors.max_participants}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-gray-900 font-kanit-bold text-base mb-2">
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
        <View className="px-6 py-4 bg-fond border-t border-gray-200">
          <Pressable
            onPress={handleSubmit}
            className="bg-primary py-4 px-8 rounded-full active:opacity-90"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white text-center font-kanit-bold text-lg">
              Créer l'événement
            </Text>
          </Pressable>
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
        title="Fonctionnalité Premium"
        description="La création d'événements sera bientôt disponible dans la version premium de l'application. Restez à l'écoute pour plus d'informations !"
      />
    </View>
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
