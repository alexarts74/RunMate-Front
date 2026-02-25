import React from "react";
import { View, Dimensions } from "react-native";
import WarmBackground from "@/components/ui/WarmBackground";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import PulseLoader from "@/components/ui/PulseLoader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface LoadingScreenProps {
  variant?: "home" | "list" | "detail" | "chat";
}

export default function LoadingScreen({ variant = "home" }: LoadingScreenProps) {
  const renderContent = () => {
    switch (variant) {
      case "list":
        return (
          <View style={{ padding: 24, gap: 16, flex: 1 }}>
            <SkeletonLoader variant="text" width="40%" height={24} />
            {[...Array(5)].map((_, i) => (
              <SkeletonLoader key={i} variant="list-item" />
            ))}
          </View>
        );

      case "detail":
        return (
          <View style={{ flex: 1 }}>
            <SkeletonLoader variant="text" width="100%" height={250} />
            <View style={{ padding: 24, gap: 16 }}>
              <SkeletonLoader variant="text" width="70%" height={24} />
              <SkeletonLoader variant="text" width="90%" height={16} />
              <SkeletonLoader variant="text" width="50%" height={16} />
              <View style={{ marginTop: 16 }}>
                <SkeletonLoader variant="card" />
              </View>
            </View>
          </View>
        );

      case "chat":
        return (
          <View style={{ flex: 1, padding: 24, gap: 12 }}>
            <SkeletonLoader variant="list-item" />
            <View style={{ height: 1, backgroundColor: "rgba(123,158,135,0.1)" }} />
            {[...Array(6)].map((_, i) => (
              <View
                key={i}
                style={{
                  alignItems: i % 2 === 0 ? "flex-end" : "flex-start",
                  paddingHorizontal: 8,
                }}
              >
                <SkeletonLoader
                  variant="text"
                  width={i % 3 === 0 ? "60%" : "40%"}
                  height={40}
                  style={{ borderRadius: 16 }}
                />
              </View>
            ))}
          </View>
        );

      default:
        // home
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <PulseLoader size={12} />
          </View>
        );
    }
  };

  return (
    <View
      style={{
        width: screenWidth,
        height: screenHeight,
        zIndex: 9999,
        position: "absolute",
      }}
    >
      <WarmBackground>{renderContent()}</WarmBackground>
    </View>
  );
}
