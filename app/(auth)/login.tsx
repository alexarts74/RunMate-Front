import { View } from "react-native";

import React from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function SignUpScreen() {
  return (
    <View className="bg-fond flex-1">
      <LoginForm />
    </View>
  );
}
