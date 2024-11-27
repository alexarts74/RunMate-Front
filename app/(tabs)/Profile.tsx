import React, { useState } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  if (!isEditing) {
    return <ProfileView setIsEditing={setIsEditing} />;
  }

  return <ProfileEditForm setIsEditing={setIsEditing} />;
}
