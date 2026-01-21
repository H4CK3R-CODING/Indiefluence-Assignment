// src/screens/Profile/UserProfileSetupScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useAuthStore from "../../state/authStore";
import NavLayout from "@/src/components/Navbar/NavLayout";

// ============================================
// Types
// ============================================

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  maxItems?: number;
}

// ============================================
// Chip Input Component
// ============================================

const ChipInput: React.FC<ChipInputProps> = ({
  value,
  onChange,
  placeholder,
  maxItems = 10,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addChip = () => {
    if (inputValue.trim() && value.length < maxItems) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View>
      <View className="flex-row flex-wrap gap-2 mb-3">
        {value.map((chip, index) => (
          <View
            key={index}
            className="bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full flex-row items-center"
          >
            <Text className="text-green-700 dark:text-green-300 text-sm font-medium mr-2">
              {chip}
            </Text>
            <TouchableOpacity onPress={() => removeChip(index)}>
              <Ionicons name="close-circle" size={18} color="#059669" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View className="flex-row items-center">
        <TextInput
          className="flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg text-gray-900 dark:text-white"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={addChip}
          returnKeyType="done"
        />
        <TouchableOpacity
          className="ml-2 bg-green-500 dark:bg-green-600 px-4 py-3 rounded-lg"
          onPress={addChip}
          disabled={!inputValue.trim() || value.length >= maxItems}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2">
        {value.length}/{maxItems} interests added. Press enter or + to add.
      </Text>
    </View>
  );
};

// ============================================
// User Profile Setup Screen
// ============================================

export default function UserProfileSetupScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { user, createOrUpdateUserProfile } = useAuthStore();

  // Form State
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load existing user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setInterests(user.interests || []);
      setContactInfo(user.contactInfo || "");
    }
  }, [user]);

  // Form Validation
  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name");
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert("Validation Error", "Name must be at least 2 characters");
      return false;
    }

    if (bio.trim().length > 300) {
      Alert.alert("Validation Error", "Bio cannot exceed 300 characters");
      return false;
    }

    return true;
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const result = await createOrUpdateUserProfile({
        name: name.trim(),
        bio: bio.trim(),
        interests,
        contactInfo: contactInfo.trim(),
      });

      if (result.success) {
        // Navigate to Pet Profile Setup if user doesn't have a pet yet
        navigation.navigate("PetProfileCreationScreen" as never);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Skip
  const handleSkip = () => {
    Alert.alert(
      "Skip Profile Setup",
      "You can complete your profile later from settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          onPress: () => navigation.navigate("PetProfileSetup" as never),
        },
      ]
    );
  };

  return (
    <NavLayout title={"User Profile Setup"}>
      <View className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        {/* <View className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <Ionicons name="arrow-back" size={24} color="#10B981" />
            </TouchableOpacity>

            <View className="flex-1 mx-4">
              <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
                Your Profile
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Step 1 of 2
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleSkip}
              className="px-3 py-2"
            >
              <Text className="text-green-600 dark:text-green-400 font-semibold">
                Skip
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <View className="h-full w-1/2 bg-green-500 dark:bg-green-600 rounded-full" />
          </View>
        </View> */}

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Welcome Section */}
          <View className="px-6 py-8 items-center">
            <View className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-4">
              <Ionicons name="person" size={48} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tell Us About You
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              Help other pet parents get to know you better
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 space-y-6">
            {/* Full Name */}
            <View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="person-outline" size={20} color="#10B981" />
                <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                  Full Name
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg text-gray-900 dark:text-white text-base"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                maxLength={100}
              />
              <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {name.length}/100 characters
              </Text>
            </View>

            {/* Bio */}
            <View className="mt-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="document-text-outline" size={20} color="#10B981" />
                <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                  Bio
                </Text>
              </View>
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg text-gray-900 dark:text-white text-base min-h-[100px]"
                placeholder="Tell us about yourself and what you're looking for..."
                placeholderTextColor="#9CA3AF"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={300}
              />
              <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {bio.length}/300 characters
              </Text>
            </View>

            {/* Interests */}
            <View className="mt-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="heart-outline" size={20} color="#10B981" />
                <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                  Interests
                </Text>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                Add hobbies and activities you enjoy with your pet
              </Text>
              <ChipInput
                value={interests}
                onChange={setInterests}
                placeholder="e.g., Hiking, Beach walks, Dog parks"
                maxItems={10}
              />
            </View>

            {/* Contact Info */}
            <View className="mt-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="call-outline" size={20} color="#10B981" />
                <Text className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                  Contact Information
                </Text>
              </View>
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg text-gray-900 dark:text-white text-base"
                placeholder="Phone number or preferred contact method"
                placeholderTextColor="#9CA3AF"
                value={contactInfo}
                onChangeText={setContactInfo}
                keyboardType="phone-pad"
              />
              <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Optional - helps other pet parents reach you
              </Text>
            </View>

            {/* Tips Card */}
            <View className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <View className="flex-row items-start">
                <Ionicons name="bulb-outline" size={24} color="#3B82F6" />
                <View className="flex-1 ml-3">
                  <Text className="text-blue-900 dark:text-blue-300 font-semibold mb-1">
                    Profile Tips
                  </Text>
                  <Text className="text-blue-700 dark:text-blue-400 text-sm">
                    • Be genuine and friendly{'\n'}
                    • Mention what activities you enjoy{'\n'}
                    • Share what makes your pet special{'\n'}
                    • Keep it positive and welcoming
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Button */}
        <View className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <TouchableOpacity
            className={`py-4 rounded-xl items-center justify-center ${
              isLoading
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-green-500 dark:bg-green-600"
            }`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">
                  Continue to Pet Profile
                </Text>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-center text-gray-500 dark:text-gray-400 text-xs mt-3">
            Next: Tell us about your furry friend 🐾
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
    </NavLayout>
  );
}