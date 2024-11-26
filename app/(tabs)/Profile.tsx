import React, { useState } from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    location: user?.location || "",
    profile_image: user?.profile_image || "",
    bio: user?.bio || "",
  });

  console.log("formData", formData);

  if (!isEditing) {
    return <ProfileView formData={formData} setIsEditing={setIsEditing} />;
  }

  return (
    <ProfileEditForm
      formData={formData}
      setFormData={setFormData}
      setIsEditing={setIsEditing}
      onUpdate={updateUser}
    />
  );
}
