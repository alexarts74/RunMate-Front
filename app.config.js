import "dotenv/config";

export default {
  expo: {
    name: "RunMate",
    slug: "runmate-front-expo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/run-mate-logo.png",
    splash: {
      image: "./assets/images/splash-screen.png",
      resizeMode: "cover",
      backgroundColor: "#1e2429",
    },
    scheme: "runmate",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    notification: {
      icon: "./assets/images/run-mate-logo.png",
      color: "#000000",
      androidMode: "default",
      androidCollapsedTitle: "RunMate",
      iosDisplayInForeground: true,
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/run-mate-logo.png",
        backgroundColor: "#000000",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/run-mate-logo.png",
    },
    plugins: ["expo-router", "expo-image-picker", "expo-location", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PROJECT_ID,
      },
    },
  },
};
