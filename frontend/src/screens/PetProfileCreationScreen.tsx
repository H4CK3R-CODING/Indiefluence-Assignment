import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import NavLayout from "../components/Navbar/NavLayout";
import useAuthStore, { PetProfileData } from "../state/authStore";

// Types
interface ValidationErrors {
  petName?: string;
  breed?: string;
  age?: string;
  weight?: string;
}

const PetProfileCreationScreen: React.FC<{ navigation: any }> = ({navigation}) => {
  // const navigation = useNavigation();
  const { createPetProfile } = useAuthStore();
  // Form State
  const [petProfile, setPetProfile] = useState<PetProfileData>({
    petName: "",
    breed: "",
    gender: "",
    age: null,
    weight: null,
    vaccinated: null,
    imageUrl: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [imageUrl, setImageUrl] = useState<string>("");

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Popular dog breeds
  const popularBreeds = [
    "Labrador",
    "German Shepherd",
    "Golden Retriever",
    "Bulldog",
    "Beagle",
    "Poodle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Persian Cat",
    "Siamese Cat",
  ];

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
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
  }, []);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!petProfile.petName.trim()) {
      newErrors.petName = "Pet name is required";
    }

    if (!petProfile.breed.trim()) {
      newErrors.breed = "Breed is required";
    }

    if (
      !petProfile.age ||
      petProfile.age === null ||
      petProfile.age === undefined
    ) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(petProfile.age)) || Number(petProfile.age) <= 0) {
      newErrors.age = "Please enter a valid age";
    }

    if (
      !petProfile.weight ||
      petProfile.weight === null ||
      petProfile.weight === undefined
    ) {
      newErrors.weight = "Weight is required";
    } else if (
      isNaN(Number(petProfile.weight)) ||
      Number(petProfile.weight) <= 0
    ) {
      newErrors.weight = "Please enter a valid weight";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!petProfile.gender) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please select your pet's gender",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (petProfile.vaccinated != true && petProfile.vaccinated != false) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please select vaccination status",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await createPetProfile(petProfile);
      // await mockCreatePetAPI(petProfile);
      setPetProfile({
        petName: "",
        breed: "",
        gender: "",
        age: null,
        weight: null,
        vaccinated: null,
        imageUrl: "",
      });
      
      Toast.show({
        type: "success",
        text1: "Profile Created! 🎉",
        text2: `${petProfile.petName}'s profile has been created successfully`,
        position: "top",
        visibilityTime: 3000,
      });

      // Navigate to My Profile
      // navigation.navigate('MyProfile' as never);
      console.log("Pet profile created:", petProfile);
    } catch (error) {
      console.error("Error creating pet profile:", error);
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: "Unable to create pet profile. Please try again.",
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NavLayout title={"Pet Profile Creation"}>
      <View className="flex-1 bg-slate-50 dark:bg-gray-900">
        {/* Background */}
        <View className="absolute inset-0">
          <LinearGradient
            colors={["#F093FB", "#F5576C", "#FD8451"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {/* Header */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
              className="pt-16 pb-6 px-6"
            >
              <View className="items-center mb-4">
                <View className="w-20 h-20 bg-white/25 backdrop-blur-xl rounded-full items-center justify-center mb-4 shadow-2xl border-3 border-white/40">
                  <Text className="text-5xl">🐕</Text>
                </View>
                <Text className="text-4xl font-extrabold text-white mb-2 text-center tracking-tight">
                  Create Pet Profile
                </Text>
                <Text className="text-white/90 text-center text-base font-semibold">
                  Tell us about your furry friend
                </Text>
              </View>
            </Animated.View>

            {/* Form Card */}
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="px-6"
            >
              <View className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 dark:border-gray-700/50 p-6">
                {/* Image URL Section */}
                <View className="mb-6">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-base">
                    Pet Photo URL
                  </Text>

                  <TextInput
                    placeholder="Paste image URL here..."
                    placeholderTextColor="#9CA3AF"
                    value={petProfile.imageUrl}
                    onChangeText={(text) => {
                      setPetProfile({ ...petProfile, imageUrl: text });
                    }}
                    className="bg-gray-100 dark:bg-gray-700/50 rounded-2xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-800 dark:text-gray-200"
                    autoCapitalize="none"
                  />

                  {petProfile.imageUrl ? (
                    <View className="mt-4 items-center">
                      <Image
                        source={{ uri: petProfile.imageUrl }}
                        className="w-32 h-32 rounded-full"
                        resizeMode="cover"
                      />
                      <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                        Image Preview
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Pet Name */}
                <View className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                    Pet Name *
                  </Text>
                  <View
                    className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.petName ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                  >
                    <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">
                      🐾
                    </Text>
                    <TextInput
                      className="flex-1 text-gray-900 dark:text-white text-base"
                      placeholder="e.g., Max, Bella, Charlie"
                      placeholderTextColor="#9CA3AF"
                      value={petProfile.petName}
                      onChangeText={(text) => {
                        setPetProfile({ ...petProfile, petName: text });
                        setErrors({ ...errors, petName: undefined });
                      }}
                      editable={!isLoading}
                    />
                  </View>
                  {errors.petName && (
                    <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                      ⚠️ {errors.petName}
                    </Text>
                  )}
                </View>

                {/* Breed */}
                <View className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                    Breed *
                  </Text>
                  <View
                    className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.breed ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                  >
                    <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">
                      🦴
                    </Text>
                    <TextInput
                      className="flex-1 text-gray-900 dark:text-white text-base"
                      placeholder="e.g., Golden Retriever, Persian Cat"
                      placeholderTextColor="#9CA3AF"
                      value={petProfile.breed}
                      onChangeText={(text) => {
                        setPetProfile({ ...petProfile, breed: text });
                        setErrors({ ...errors, breed: undefined });
                      }}
                      editable={!isLoading}
                    />
                  </View>
                  {errors.breed && (
                    <Text className="text-red-500 text-sm mt-2 ml-1 font-medium">
                      ⚠️ {errors.breed}
                    </Text>
                  )}

                  {/* Popular Breeds */}
                  <View className="mt-3">
                    <Text className="text-gray-600 dark:text-gray-400 text-xs mb-2 font-medium">
                      Popular breeds:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {popularBreeds.slice(0, 6).map((breed) => (
                        <TouchableOpacity
                          key={breed}
                          onPress={() =>
                            setPetProfile({ ...petProfile, breed })
                          }
                          className="bg-pink-100 dark:bg-pink-900/30 rounded-full px-3 py-1.5 mr-2 mb-2"
                        >
                          <Text className="text-pink-600 dark:text-pink-400 text-xs font-semibold">
                            {breed}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Gender Selection */}
                <View className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-base">
                    Gender *
                  </Text>
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={() =>
                        setPetProfile({ ...petProfile, gender: "Male" })
                      }
                      className={`flex-1 rounded-xl p-4 border-2 ${
                        petProfile.gender === "Male"
                          ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="items-center">
                        <Text className="text-3xl mb-2">♂️</Text>
                        <Text
                          className={`font-bold ${
                            petProfile.gender === "Male"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          Male
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setPetProfile({ ...petProfile, gender: "Female" })
                      }
                      className={`flex-1 rounded-xl p-4 border-2 ${
                        petProfile.gender === "Female"
                          ? "bg-pink-50 dark:bg-pink-900/30 border-pink-500"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="items-center">
                        <Text className="text-3xl mb-2">♀️</Text>
                        <Text
                          className={`font-bold ${
                            petProfile.gender === "Female"
                              ? "text-pink-600 dark:text-pink-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          Female
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Age and Weight Row */}
                <View className="flex-row space-x-3 mb-5">
                  {/* Age */}
                  <View className="flex-1">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                      Age (years) *
                    </Text>
                    <View
                      className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.age ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    >
                      <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">
                        🎂
                      </Text>
                      <TextInput
                        className="flex-1 text-gray-900 dark:text-white text-base"
                        placeholder="2"
                        placeholderTextColor="#9CA3AF"
                        value={petProfile.age?.toString() || ""}
                        onChangeText={(text) => {
                          const numericValue = text.replace(/[^0-9]/g, ""); // allow only digits

                          setPetProfile({
                            ...petProfile,
                            age:
                              numericValue === "" ? null : Number(numericValue),
                          });

                          setErrors({ ...errors, age: undefined });
                        }}
                        keyboardType="numeric"
                        editable={!isLoading}
                      />
                    </View>
                    {errors.age && (
                      <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
                        ⚠️ {errors.age}
                      </Text>
                    )}
                  </View>

                  {/* Weight */}
                  <View className="flex-1">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                      Weight (kg) *
                    </Text>
                    <View
                      className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.weight ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    >
                      <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">
                        ⚖️
                      </Text>
                      <TextInput
                        className="flex-1 text-gray-900 dark:text-white text-base"
                        placeholder="25"
                        placeholderTextColor="#9CA3AF"
                        value={petProfile.weight?.toString() || ""}
                        onChangeText={(text) => {
                          const numericValue = text
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*)\./g, "$1"); // allow decimals if needed

                          setPetProfile({
                            ...petProfile,
                            weight:
                              numericValue === "" ? null : Number(numericValue),
                          });

                          setErrors({ ...errors, weight: undefined });
                        }}
                        keyboardType="numeric"
                        editable={!isLoading}
                      />
                    </View>
                    {errors.weight && (
                      <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
                        ⚠️ {errors.weight}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Vaccination Status */}
                <View className="mb-6">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-base">
                    Vaccination Status *
                  </Text>
                  <View className="flex-row space-x-3">
                    <TouchableOpacity
                      onPress={() =>
                        setPetProfile({ ...petProfile, vaccinated: true })
                      }
                      className={`flex-1 rounded-xl p-4 border-2 ${
                        petProfile.vaccinated === true
                          ? "bg-green-50 dark:bg-green-900/30 border-green-500"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="items-center">
                        <Text className="text-3xl mb-2">💉</Text>
                        <Text
                          className={`font-bold ${
                            petProfile.vaccinated === true
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          Vaccinated
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setPetProfile({ ...petProfile, vaccinated: false })
                      }
                      className={`flex-1 rounded-xl p-4 border-2 ${
                        petProfile.vaccinated === false
                          ? "bg-orange-50 dark:bg-orange-900/30 border-orange-500"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="items-center">
                        <Text className="text-3xl mb-2">⚠️</Text>
                        <Text
                          className={`font-bold ${
                            petProfile.vaccinated === false
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          Not Yet
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className="overflow-hidden rounded-xl shadow-2xl"
                  activeOpacity={0.85}
                  style={{
                    elevation: 8,
                    shadowColor: "#F5576C",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                >
                  <LinearGradient
                    colors={["#F093FB", "#F5576C"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-4 px-6"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white text-center font-extrabold text-lg tracking-wide">
                        {isLoading
                          ? "Creating Profile..."
                          : "Create Pet Profile"}
                      </Text>
                      {!isLoading && (
                        <Text className="text-white text-xl ml-2">🎉</Text>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mt-4">
                  * Required fields
                </Text>
              </View>

              {/* Info Card */}
              <View className="mt-6 mb-6">
                <View className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border-2 border-white/50 dark:border-gray-700/50">
                  <View className="flex-row items-start">
                    <Text className="text-3xl mr-3">💡</Text>
                    <View className="flex-1">
                      <Text className="text-gray-700 dark:text-gray-300 font-bold mb-1">
                        Profile Tips
                      </Text>
                      <Text className="text-gray-600 dark:text-gray-400 text-sm leading-5">
                        Add a clear photo and complete details to increase your
                        pet's chances of finding the perfect match!
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Loading Overlay */}
        {isLoading && (
          <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
            <View className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-gray-200 dark:border-gray-700">
              <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-4 text-center">
                Creating profile...
              </Text>
              <View className="items-center">
                <Text className="text-5xl mb-2">🐾</Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  Please wait
                </Text>
              </View>
            </View>
          </View>
        )}

        <Toast />
      </View>
    </NavLayout>
  );
};

// Mock API function
const mockCreatePetAPI = async (petData: PetProfileData): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Pet profile created:", petData);
};

export default PetProfileCreationScreen;
