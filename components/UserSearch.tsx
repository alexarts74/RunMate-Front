import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userService } from "@/service/api/user";
import User from "@/interface/User";

const ACCENT = "#F97316";

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  selectedUsers: User[];
}

export function UserSearch({ onSelectUser, selectedUsers }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.length === 0) {
      setSearchResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await userService.searchUsers(searchQuery);
        if (Array.isArray(results)) {
          const filteredResults = results.filter(
            (user) => !selectedUsers.some((selected) => selected.id === user.id)
          );
          setSearchResults(filteredResults);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Erreur recherche utilisateurs:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, selectedUsers]);

  return (
    <View className="mb-4">
      <View className="flex-row items-center bg-white rounded-xl px-4 border-2 border-gray-200"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Ionicons name="search" size={20} color={ACCENT} style={{ marginRight: 8 }} />
        <TextInput
          className="flex-1 text-gray-900 p-4 font-nunito-medium"
          placeholder="Rechercher des participants..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
          }}
        />
      </View>

      {isSearching ? (
        <View className="bg-white rounded-xl mt-2 p-4 border-2 border-gray-200 items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <ActivityIndicator color={ACCENT} />
        </View>
      ) : (
        searchResults.length > 0 && (
          <View
            className="bg-white rounded-xl mt-2 border-2 border-gray-200"
            style={{ 
              maxHeight: 200,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled={true}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelectUser(item);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="flex-row items-center p-3 border-b border-gray-100"
                  android_ripple={{ color: "rgba(249, 115, 22, 0.1)" }}
                >
                  <Image
                    source={{ uri: item.profile_image }}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <Text className="text-gray-900 ml-3 font-nunito-medium">
                    {item.first_name} {item.last_name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )
      )}

      {selectedUsers.length > 0 && (
        <View className="mt-4">
          <Text className="text-gray-900 font-nunito-bold text-base mb-3">Participants invités</Text>
          <View className="flex-row flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <View
                key={user.id}
                className="flex-row items-center bg-white rounded-full px-3 py-1.5 border-2 border-tertiary"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <Image
                  source={{ uri: user.profile_image }}
                  className="w-6 h-6 rounded-full border border-gray-200"
                />
                <Text className="text-gray-700 mx-2 font-nunito-medium text-sm">{user.first_name}</Text>
                <Pressable onPress={() => onSelectUser(user)}>
                  <Ionicons name="close-circle" size={18} color={ACCENT} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
