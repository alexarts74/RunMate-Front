import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { userService } from "@/service/api/user";
import User from "@/interface/User";
import PulseLoader from "@/components/ui/PulseLoader";
import { useThemeColors, palette } from "@/constants/theme";

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  selectedUsers: User[];
}

export function UserSearch({ onSelectUser, selectedUsers }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors, shadows } = useThemeColors();

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
      <View
        className="flex-row items-center rounded-xl px-4"
        style={{
          backgroundColor: colors.glass.light,
          borderWidth: 1,
          borderColor: colors.glass.border,
          ...shadows.sm,
        }}
      >
        <Ionicons name="search" size={20} color={colors.primary.DEFAULT} style={{ marginRight: 8 }} />
        <TextInput
          className="flex-1 p-4 font-nunito-medium"
          style={{ color: colors.text.primary }}
          placeholder="Rechercher des participants..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
          }}
        />
      </View>

      {isSearching ? (
        <View
          className="rounded-xl mt-2 p-4 items-center justify-center"
          style={{
            backgroundColor: colors.glass.light,
            borderWidth: 1,
            borderColor: colors.glass.border,
            ...shadows.sm,
          }}
        >
          <PulseLoader color={colors.primary.DEFAULT} />
        </View>
      ) : (
        searchResults.length > 0 && (
          <View
            className="rounded-xl mt-2"
            style={{
              maxHeight: 200,
              backgroundColor: colors.elevated,
              borderWidth: 1,
              borderColor: colors.glass.border,
              ...shadows.md,
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
                  className="flex-row items-center p-3"
                  style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}
                  android_ripple={{ color: palette.primary.subtle }}
                >
                  <Image
                    source={{ uri: item.profile_image }}
                    className="w-10 h-10 rounded-full"
                    style={{ borderWidth: 1, borderColor: colors.glass.border }}
                  />
                  <Text style={{ color: colors.text.primary }} className="ml-3 font-nunito-medium">
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
          <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base mb-3">Participants invités</Text>
          <View className="flex-row flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <View
                key={user.id}
                className="flex-row items-center rounded-full px-3 py-1.5"
                style={{
                  backgroundColor: colors.glass.light,
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  ...shadows.sm,
                }}
              >
                <Image
                  source={{ uri: user.profile_image }}
                  className="w-6 h-6 rounded-full"
                  style={{ borderWidth: 1, borderColor: colors.glass.border }}
                />
                <Text style={{ color: colors.text.secondary }} className="mx-2 font-nunito-medium text-sm">{user.first_name}</Text>
                <Pressable onPress={() => onSelectUser(user)}>
                  <Ionicons name="close-circle" size={18} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
