import React, { useState } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {isEditing ? (
        <ProfileEditForm setIsEditing={setIsEditing} />
      ) : (
        <ProfileView setIsEditing={setIsEditing} />
      )}
    </>
  );
}
