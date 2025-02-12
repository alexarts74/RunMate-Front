import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
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
    }
  };

  return (
    <View className="flex-1 bg-[#12171b] pt-8">
      <View className="flex-row items-center p-4 border-b border-[#394047]">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="close" size={24} color="#b9f144" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Créer un événement</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="space-y-4">
          {/* Image de couverture */}
          <Pressable
            onPress={handleImagePick}
            className="h-40 bg-[#1e2429] rounded-xl items-center justify-center mb-4"
          >
            {formData.cover_image ? (
              <Image
                source={{ uri: formData.cover_image }}
                className="w-full h-full rounded-xl"
              />
            ) : (
              <View className="items-center">
                <Ionicons name="image-outline" size={40} color="#394047" />
                <Text className="text-[#394047] mt-2">Ajouter une photo</Text>
              </View>
            )}
          </Pressable>

          {/* Nom */}
          <View>
            <Text className="text-white text-lg mb-2">Nom de l'événement</Text>
            <TextInput
              className="bg-[#1e2429] text-white p-4 rounded-xl"
              placeholder="Ex: Course matinale"
              placeholderTextColor="#394047"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-white text-lg mb-2">Description</Text>
            <TextInput
              className="bg-[#1e2429] text-white p-4 rounded-xl"
              placeholder="Décrivez votre événement"
              placeholderTextColor="#394047"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </View>

          {/* Date */}
          <View>
            <Text className="text-white text-lg mb-2">Date et heure</Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="bg-[#1e2429] p-4 rounded-xl"
            >
              <Text className="text-white">
                {formData.start_date.toLocaleString()}
              </Text>
            </Pressable>
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
            <View className="flex-row flex-wrap gap-2">
              {Object.values(EventLevel)
                .filter((value) => typeof value === "number")
                .map((value) => (
                  <Pressable
                    key={value}
                    onPress={() =>
                      setFormData({ ...formData, level: value as EventLevel })
                    }
                    className={`px-4 py-2 rounded-xl ${
                      formData.level === value ? "bg-green" : "bg-[#1e2429]"
                    }`}
                  >
                    <Text
                      className={`${
                        formData.level === value
                          ? "text-[#12171b]"
                          : "text-white"
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
              className="bg-[#1e2429] text-white p-4 rounded-xl"
              placeholder="Rechercher une adresse..."
              placeholderTextColor="#394047"
              value={formData.location}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, location: text }));
                searchLocation(text);
              }}
            />

            {suggestions.length > 0 && (
              <View className="bg-[#1e2429] mt-1 rounded-xl overflow-hidden absolute w-full z-10">
                {suggestions.map((suggestion, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSelectLocation(suggestion)}
                    className="p-4 border-b border-[#394047]"
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
              className="bg-[#1e2429] text-white p-4 rounded-xl"
              placeholder="Ex: 5"
              placeholderTextColor="#394047"
              keyboardType="numeric"
              value={formData.distance}
              onChangeText={(text) =>
                setFormData({ ...formData, distance: text })
              }
            />
          </View>

          {/* Nombre max de participants */}
          <View>
            <Text className="text-white text-lg mb-2">
              Nombre maximum de participants
            </Text>
            <TextInput
              className="bg-[#1e2429] text-white p-4 rounded-xl"
              placeholder="Ex: 10"
              placeholderTextColor="#394047"
              keyboardType="numeric"
              value={formData.max_participants}
              onChangeText={(text) =>
                setFormData({ ...formData, max_participants: text })
              }
            />
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

      {/* Footer */}
      <View className="p-4 w-[70%] mx-auto">
        <Pressable
          onPress={handleSubmit}
          className="bg-green p-2 mb-4 rounded-full active:opacity-90"
        >
          <Text className="text-[#12171b] text-center font-bold text-lg">
            Créer l'événement
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
