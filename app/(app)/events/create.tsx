import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { eventService } from "@/service/api/event";
import { CreateEventData } from "@/interface/Event";
import { UserSearch } from "@/components/UserSearch";
import User from "@/interface/User";
import { debounce } from "lodash";
import * as Location from "expo-location";
import { BlurView } from "expo-blur";
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

  const geocodeLocation = useCallback(
    debounce(async (address: string) => {
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
    }, 1000),
    []
  );

  const searchLocation = useCallback(
    debounce(async (text: string) => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

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
    }, 300),
    []
  );

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
    <View className="flex-1 bg-background pt-8">
      <View
        style={[styles.container, showPremiumModal && styles.blurContainer]}
      >
        <View className="flex-row items-center p-4 border-b border-gray-700">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="close" size={24} color="#8101f7" />
          </Pressable>
          <Text className="text-white text-xl font-bold">
            Créer un événement
          </Text>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            {/* Image de couverture */}
            <View>
              <Pressable
                onPress={handleImagePick}
                className="h-40 bg-[#1e2429] rounded-xl items-center justify-center mb-1 border border-gray-700"
              >
                {formData.cover_image ? (
                  <Image
                    source={{ uri: formData.cover_image }}
                    className="w-full h-full rounded-xl"
                  />
                ) : (
                  <View className="items-center">
                    <Ionicons name="image-outline" size={40} color="#687076" />
                    <Text className="text-[#687076] mt-2">
                      Ajouter une photo
                    </Text>
                  </View>
                )}
              </Pressable>
              {errors.cover_image && (
                <Text className="text-red-500 text-sm">
                  {errors.cover_image}
                </Text>
              )}
            </View>

            {/* Nom */}
            <View>
              <Text className="text-white text-lg mb-2">
                Nom de l'événement
              </Text>
              <TextInput
                className={`bg-[#1e2429] text-white p-4 rounded-xl border ${
                  errors.name ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Ex: Course matinale"
                placeholderTextColor="#687076"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
              )}
            </View>

            {/* Description */}
            <View>
              <Text className="text-white text-lg mb-2">Description</Text>
              <TextInput
                className={`bg-[#1e2429] text-white p-4 rounded-xl border ${
                  errors.description ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Décrivez votre événement"
                placeholderTextColor="#687076"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
              />
              {errors.description && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.description}
                </Text>
              )}
            </View>

            {/* Date */}
            <View>
              <Text className="text-white text-lg mb-2">Date et heure</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className={`bg-[#1e2429] p-4 rounded-xl border ${
                  errors.start_date ? "border-red-500" : "border-gray-700"
                }`}
              >
                <Text className="text-white">
                  {formData.start_date.toLocaleString()}
                </Text>
              </Pressable>
              {errors.start_date && (
                <Text className="text-red-500 text-sm mt-1">
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
              <Text className="text-white text-lg mb-2">Niveau</Text>
              <View className="flex-row justify-between flex-wrap gap-2">
                {Object.values(EventLevel)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <Pressable
                      key={value}
                      onPress={() =>
                        setFormData({ ...formData, level: value as EventLevel })
                      }
                      className={`flex-1 min-w-[45%] px-4 py-3 rounded-xl ${
                        formData.level === value
                          ? "bg-purple"
                          : "bg-[#1e2429] border border-gray-700"
                      }`}
                    >
                      <Text
                        className={`text-center font-medium ${
                          formData.level === value ? "text-white" : "text-white"
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
              <Text className="text-white text-lg mb-2">Lieu</Text>
              <TextInput
                className={`bg-[#1e2429] text-white p-4 rounded-xl border ${
                  errors.location ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Rechercher une adresse..."
                placeholderTextColor="#687076"
                value={formData.location}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, location: text }));
                  searchLocation(text);
                }}
              />
              {errors.location && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.location}
                </Text>
              )}

              {suggestions.length > 0 && (
                <View className="bg-[#1e2429] mt-1 rounded-xl overflow-hidden absolute w-full z-10 border border-gray-700">
                  {suggestions.map((suggestion, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectLocation(suggestion)}
                      className="p-4 border-b border-gray-700"
                      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
                    >
                      <Text className="text-white">{suggestion.full_name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Distance */}
            <View>
              <Text className="text-white text-lg mb-2">Distance (km)</Text>
              <TextInput
                className={`bg-[#1e2429] text-white p-4 rounded-xl border ${
                  errors.distance ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Ex: 5"
                placeholderTextColor="#687076"
                keyboardType="numeric"
                value={formData.distance}
                onChangeText={(text) =>
                  setFormData({ ...formData, distance: text })
                }
              />
              {errors.distance && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.distance}
                </Text>
              )}
            </View>

            {/* Nombre max de participants */}
            <View>
              <Text className="text-white text-lg mb-2">
                Nombre maximum de participants
              </Text>
              <TextInput
                className={`bg-[#1e2429] text-white p-4 rounded-xl border ${
                  errors.max_participants ? "border-red-500" : "border-gray-700"
                }`}
                placeholder="Ex: 10"
                placeholderTextColor="#687076"
                keyboardType="numeric"
                value={formData.max_participants}
                onChangeText={(text) =>
                  setFormData({ ...formData, max_participants: text })
                }
              />
              {errors.max_participants && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.max_participants}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-white text-lg mb-2">
                Inviter des participants
              </Text>
              <UserSearch
                onSelectUser={handleUserSelect}
                selectedUsers={selectedUsers}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Footer */}
      <View className="p-4 w-[70%] mx-auto mb-2">
        <Pressable
          onPress={handleSubmit}
          className="bg-purple py-4 px-8 rounded-full active:opacity-90"
        >
          <Text className="text-white text-center font-bold text-lg">
            Créer l'événement
          </Text>
        </Pressable>
      </View>

      {/* Modal Premium */}
      <PremiumFeatureModal
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
