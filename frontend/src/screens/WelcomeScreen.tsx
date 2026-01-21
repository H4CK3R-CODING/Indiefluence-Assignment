import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import NavLayout from "@/src/components/Navbar/NavLayout";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Feature {
  icon: string;
  title: string;
  description: string;
  gradient: string[];
}

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const features: Feature[] = [
    {
      icon: "🐾",
      title: "Find Perfect Matches",
      description:
        "Connect your pets with compatible companions in your area using smart matching",
      gradient: ["#667EEA", "#764BA2"],
    },
    {
      icon: "💕",
      title: "Pet Playdates",
      description:
        "Arrange safe and fun meetups for your furry friends with verified pet owners",
      gradient: ["#F093FB", "#F5576C"],
    },
    {
      icon: "👥",
      title: "Pet Community",
      description:
        "Join a thriving community of loving pet owners and share experiences",
      gradient: ["#4FACFE", "#00F2FE"],
    },
    {
      icon: "📸",
      title: "Share Moments",
      description:
        "Showcase your pet's unique personality with photos, videos and stories",
      gradient: ["#43E97B", "#38F9D7"],
    },
  ];

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Floating animations for background shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 15,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Auto-scroll carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const navigateToAuth = (isLogin: boolean): void => {
    navigation.navigate("Auth");
    console.log(`Navigate to ${isLogin ? "Login" : "Register"}`);
  };

  return (
    <NavLayout title={"Welcome"}>
      <View className="flex-1 bg-purple-50 dark:bg-gray-900">
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Enhanced Animated Background with Gradient */}
        <View className="absolute inset-0">
          <LinearGradient
            colors={["#667EEA", "#764BA2", "#F093FB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
          />

          {/* Animated floating background shapes with blur effect */}
          <Animated.View
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6],
              }),
              transform: [{ translateY: floatAnim1 }],
            }}
            className="absolute top-16 left-8 w-40 h-40 bg-white/20 rounded-full"
          />
          <Animated.View
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
              transform: [{ translateY: floatAnim2 }],
            }}
            className="absolute top-32 right-4 w-48 h-48 bg-white/15 rounded-full"
          />
          <Animated.View
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.4],
              }),
              transform: [{ translateY: floatAnim1 }],
            }}
            className="absolute bottom-28 left-4 w-44 h-44 bg-white/25 rounded-full"
          />
          <Animated.View
            style={{
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
              transform: [{ translateY: floatAnim2 }],
            }}
            className="absolute bottom-52 right-8 w-36 h-36 bg-white/20 rounded-full"
          />

          {/* Subtle grid overlay */}
          <View className="absolute inset-0 opacity-5">
            <View className="flex-1" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Hero Section */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
            }}
            className="flex-1 items-center justify-center px-6 pt-16"
          >
            {/* Enhanced Logo/Icon */}
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
              className="mb-6"
            >
              <View className="relative">
                {/* Glow effect */}
                <View className="absolute inset-0 w-36 h-36 bg-white/30 rounded-full blur-2xl" />
                {/* Main logo container */}
                <View className="w-36 h-36 bg-white/25 rounded-full items-center justify-center backdrop-blur-xl border-4 border-white/40 shadow-2xl">
                  <Text className="text-8xl">🐾</Text>
                </View>
              </View>
            </Animated.View>

            {/* Enhanced App Title */}
            <View className="items-center mb-4">
              <Text className="text-6xl font-extrabold text-white mb-2 text-center tracking-tight">
                PetMatch
              </Text>
              <View className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mt-1 border border-white/30">
                <Text className="text-lg text-white/95 text-center font-semibold tracking-wide">
                  Where Tails Meet & Hearts Connect
                </Text>
              </View>
            </View>

            {/* Premium Badge */}
            <View className="bg-white/25 backdrop-blur-xl rounded-2xl px-6 py-3 mb-10 border-2 border-white/40 shadow-lg">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">🌟</Text>
                <Text className="text-white text-center text-base font-bold tracking-wide">
                  The #1 Social Network for Pets
                </Text>
              </View>
            </View>

            {/* Enhanced Features Carousel */}
            <View className="w-full mb-10">
              <View className="h-48">
                {features.map((feature, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      opacity: currentSlide === index ? 1 : 0,
                      transform: [
                        {
                          translateX: currentSlide === index ? 0 : 100,
                        },
                        {
                          scale: currentSlide === index ? 1 : 0.9,
                        },
                      ],
                      position: "absolute",
                      width: "100%",
                    }}
                  >
                    <View className="bg-white/25 backdrop-blur-xl rounded-3xl p-7 border-2 border-white/40 shadow-2xl">
                      <View className="items-center">
                        {/* Icon with background */}
                        <View className="bg-white/30 rounded-full w-20 h-20 items-center justify-center mb-4 shadow-lg">
                          <Text className="text-5xl">{feature.icon}</Text>
                        </View>
                        <Text className="text-white font-bold text-2xl mb-3 text-center tracking-tight">
                          {feature.title}
                        </Text>
                        <Text className="text-white/95 text-center text-base leading-6 font-medium">
                          {feature.description}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>

              {/* Enhanced Carousel Indicators */}
              <View className="flex-row justify-center mt-5">
                {features.map((_, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      width: currentSlide === index ? 32 : 8,
                    }}
                    className={`h-2 rounded-full mx-1.5 ${
                      currentSlide === index
                        ? "bg-white shadow-lg"
                        : "bg-white/40"
                    }`}
                  />
                ))}
              </View>
            </View>

            {/* Enhanced Stats Section */}
            <View className="bg-white/20 backdrop-blur-xl rounded-3xl border-2 border-white/40 shadow-2xl w-full p-6 mb-10">
              <View className="flex-row justify-around">
                <View className="items-center flex-1">
                  <Text className="text-4xl font-extrabold text-white mb-1.5 tracking-tight">
                    10K+
                  </Text>
                  <Text className="text-white/90 text-sm font-semibold">
                    Happy Pets
                  </Text>
                </View>
                <View className="w-px bg-white/40 mx-2" />
                <View className="items-center flex-1">
                  <Text className="text-4xl font-extrabold text-white mb-1.5 tracking-tight">
                    5K+
                  </Text>
                  <Text className="text-white/90 text-sm font-semibold">
                    Matches Made
                  </Text>
                </View>
                <View className="w-px bg-white/40 mx-2" />
                <View className="items-center flex-1">
                  <Text className="text-4xl font-extrabold text-white mb-1.5 tracking-tight">
                    50+
                  </Text>
                  <Text className="text-white/90 text-sm font-semibold">
                    Cities
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Enhanced Bottom Section - CTA Buttons */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }}
            className="px-6 pb-10"
          >
            {/* Get Started Button - Enhanced */}
            <TouchableOpacity
              onPress={() => navigateToAuth(false)}
              activeOpacity={0.85}
              className="mb-4 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <LinearGradient
                colors={["#FFFFFF", "#F8F9FA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-5 px-6"
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-purple-600 text-center font-extrabold text-lg tracking-wide">
                    Get Started Free
                  </Text>
                  <Text className="text-purple-600 text-xl ml-2">🚀</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Button - Enhanced */}
            {/* <TouchableOpacity
              onPress={() => navigateToAuth(true)}
              activeOpacity={0.85}
              className="mb-6 rounded-2xl overflow-hidden border-2 border-white/60 shadow-xl"
              style={{
                elevation: 6,
                shadowColor: "#FFF",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              }}
            >
              <View className="py-5 px-6 bg-white/15 backdrop-blur-xl">
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-center font-bold text-lg tracking-wide">
                    Sign In
                  </Text>
                  <Text className="text-white text-xl ml-2">👋</Text>
                </View>
              </View>
            </TouchableOpacity> */}

            {/* Enhanced Trust Indicators */}
            <View className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 mb-6 border-2 border-white/40">
              <View className="flex-row items-center justify-around">
                <View className="items-center">
                  <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center mb-2 shadow-lg">
                    <Text className="text-2xl">🔒</Text>
                  </View>
                  <Text className="text-white/90 text-xs font-bold">
                    Secure
                  </Text>
                </View>
                <View className="items-center">
                  <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center mb-2 shadow-lg">
                    <Text className="text-2xl">✅</Text>
                  </View>
                  <Text className="text-white/90 text-xs font-bold">
                    Verified
                  </Text>
                </View>
                <View className="items-center">
                  <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center mb-2 shadow-lg">
                    <Text className="text-2xl">⚡</Text>
                  </View>
                  <Text className="text-white/90 text-xs font-bold">Fast</Text>
                </View>
                <View className="items-center">
                  <View className="w-12 h-12 bg-white/30 rounded-full items-center justify-center mb-2 shadow-lg">
                    <Text className="text-2xl">💯</Text>
                  </View>
                  <Text className="text-white/90 text-xs font-bold">Free</Text>
                </View>
              </View>
            </View>

            {/* Enhanced Terms */}
            <Text className="text-white/80 text-xs text-center leading-5 font-medium">
              By continuing, you agree to our{"\n"}
              <Text className="text-white font-bold underline">
                Terms of Service
              </Text>
              {" & "}
              <Text className="text-white font-bold underline">
                Privacy Policy
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Enhanced Decorative Bottom Wave */}
        <View className="absolute bottom-0 left-0 right-0 h-32 opacity-10 pointer-events-none">
          <View className="absolute bottom-0 left-0 right-0 h-40 bg-white rounded-t-[100px]" />
        </View>
      </View>
    </NavLayout>
  );
};

export default WelcomeScreen;
