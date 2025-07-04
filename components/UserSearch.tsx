import React, { useState } from "react";
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
import { debounce } from "lodash";
import User from "@/interface/User";

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  selectedUsers: User[];
}

export function UserSearch({ onSelectUser, selectedUsers }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = debounce(async (query: string) => {
    if (query.length < 0) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const results = await userService.searchUsers(query);
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
  }, 300);

  return (
    <View className="mb-4">
      <View className="flex-row items-center bg-[#1e2429] rounded-xl px-4">
        <Ionicons name="search" size={20} color="#394047" />
        <TextInput
          className="flex-1 text-white p-4"
          placeholder="Rechercher des participants..."
          placeholderTextColor="#394047"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            searchUsers(text);
          }}
        />
      </View>

      {isSearching ? (
        <View className="bg-[#1e2429] rounded-xl mt-2 p-4">
          <ActivityIndicator color="#394047" />
        </View>
      ) : (
        searchResults.length > 0 && (
          <View
            className="bg-[#1e2429] rounded-xl mt-2"
            style={{ maxHeight: 200 }}
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
                  className="flex-row items-center p-3 border-b border-[#394047]"
                >
                  <Image
                    source={{ uri: item.profile_image }}
                    className="w-8 h-8 rounded-full"
                  />
                  <Text className="text-white ml-3">
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
          <Text className="text-white text-lg mb-2">Participants invités</Text>
          <View className="flex-row flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <View
                key={user.id}
                className="flex-row items-center bg-[#1e2429] rounded-full px-3 py-1"
              >
                <Image
                  source={{ uri: user.profile_image }}
                  className="w-6 h-6 rounded-full"
                />
                <Text className="text-white mx-2">{user.first_name}</Text>
                <Pressable onPress={() => onSelectUser(user)}>
                  <Ionicons name="close-circle" size={20} color="#394047" />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
