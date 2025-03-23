import "dotenv/config";

export default {
  expo: {
    name: "RunMate",
    slug: "runmate-front-expo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/splaash.png",
    splash: {
      image: "./assets/images/splaash.png",
      resizeMode: "cover",
      backgroundColor: "#14141b",
    },
    scheme: "runmate",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    notification: {
      icon: "./assets/images/splaash.png",
      color: "#000000",
      androidMode: "default",
      androidCollapsedTitle: "RunMate",
      iosDisplayInForeground: true,
    },
    ios: {
      supportsTablet: true,
      splash: {
        image: "./assets/images/splaash.png",
        resizeMode: "cover",
        backgroundColor: "#14141b",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/splaash.png",
        backgroundColor: "#14141b",
      },
      splash: {
        image: "./assets/images/splaash.png",
        resizeMode: "cover",
        backgroundColor: "#14141b",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/splaash.png",
      splash: {
        image: "./assets/images/splaash.png",
        resizeMode: "cover",
        backgroundColor: "#14141b",
      },
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
