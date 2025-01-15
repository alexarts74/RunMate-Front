import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { groupService } from "@/service/api/group";

type CreateEventFormProps = {
  groupId: string;
  onEventCreated: () => void;
  onClose: () => void;
};

export const CreateEventForm = ({
  groupId,
  onEventCreated,
  onClose,
}: CreateEventFormProps) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    distance: "",
    meeting_point: "",
    pace: "",
    max_participants: "",
  });

  const handleSubmit = async () => {
    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      await groupService.createGroupEvent(groupId, {
        ...form,
        date: dateTime.toISOString(),
        distance: parseFloat(form.distance),
        max_participants: parseInt(form.max_participants),
      });
      Alert.alert("Succès", "Événement créé avec succès !");
      onEventCreated();
      onClose();
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer l'événement");
    }
  };

  return (
    <View className="bg-[#1e2429] p-5 rounded-xl">
      <Text className="text-white text-xl font-bold mb-4">
        Créer un événement
      </Text>

      <TextInput
        placeholder="Titre"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
        multiline
      />

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={form.date}
        onChangeText={(text) => setForm({ ...form, date: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Heure (HH:MM)"
        value={form.time}
        onChangeText={(text) => setForm({ ...form, time: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Distance (km)"
        value={form.distance}
        onChangeText={(text) => setForm({ ...form, distance: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Point de rendez-vous"
        value={form.meeting_point}
        onChangeText={(text) => setForm({ ...form, meeting_point: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Allure (min/km)"
        value={form.pace}
        onChangeText={(text) => setForm({ ...form, pace: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-3"
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Nombre max de participants"
        value={form.max_participants}
        onChangeText={(text) => setForm({ ...form, max_participants: text })}
        className="bg-[#12171b] text-white p-3 rounded-lg mb-4"
        placeholderTextColor="#666"
        keyboardType="numeric"
      />

      <View className="flex-row justify-end space-x-3">
        <Pressable
          onPress={onClose}
          className="bg-[#12171b] py-2 px-4 rounded-lg"
        >
          <Text className="text-white">Annuler</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          className="bg-green py-2 px-4 rounded-lg"
        >
          <Text className="text-[#12171b] font-bold">Créer</Text>
        </Pressable>
      </View>
    </View>
  );
};
