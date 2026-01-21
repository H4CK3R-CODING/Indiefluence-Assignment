// src/screens/Profile/MyProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import NavLayout from "@/src/components/Navbar/NavLayout";
import useAuthStore from "../state/authStore";

// ============================================
// Types
// ============================================

interface InfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconColor?: string;
}

interface InterestChipProps {
  text: string;
}

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onEdit?: () => void;
}

// ============================================
// Info Card Component
// ============================================

const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, 
  label, 
  value, 
  iconColor = "#10B981" 
}) => (
  <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-3">
    <View className="flex-row items-center mb-2">
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text className="ml-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
        {label}
      </Text>
    </View>
    <Text className="text-gray-900 dark:text-white text-base font-semibold ml-6">
      {value || "Not specified"}
    </Text>
  </View>
);

// ============================================
// Interest Chip Component
// ============================================

const InterestChip: React.FC<InterestChipProps> = ({ text }) => (
  <View className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mr-2 mb-2">
    <Text className="text-green-700 dark:text-green-300 font-medium">
      {text}
    </Text>
  </View>
);

// ============================================
// Section Header Component
// ============================================

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, onEdit }) => (
  <View className="flex-row items-center justify-between mb-4">
    <View className="flex-row items-center">
      <Ionicons name={icon} size={24} color="#10B981" />
      <Text className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </Text>
    </View>
    {onEdit && (
      <TouchableOpacity
        onPress={onEdit}
        className="bg-green-500 dark:bg-green-600 px-4 py-2 rounded-lg"
      >
        <View className="flex-row items-center">
          <Ionicons name="create-outline" size={16} color="white" />
          <Text className="ml-1 text-white font-semibold text-sm">Edit</Text>
        </View>
      </TouchableOpacity>
    )}
  </View>
);

// ============================================
// My Profile Screen
// ============================================

export default function MyProfileScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const { user, pet, getUserProfile, getPetProfile, logout } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getUserProfile();
      await getPetProfile();
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load profile data on mount
  useEffect(() => {
    onRefresh();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <NavLayout title="My Profile">
      <View className="flex-1 bg-white dark:bg-gray-900">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
              colors={["#10B981"]}
            />
          }
        >
          {/* Profile Header */}
          <View className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 pt-8 pb-12">
            <View className="items-center">
              {/* Avatar */}
              {/* <View className="w-28 h-28 rounded-full bg-white items-center justify-center shadow-lg mb-4">
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Ionicons name="person" size={56} color="#10B981" />
                )}
              </View> */}

              {/* Name */}
              <Text className="text-2xl font-bold text-white mb-1">
                {user?.name || "Pet Parent"}
              </Text>

              {/* Email */}
              <Text className="text-white/90 text-base mb-4">
                {user?.email}
              </Text>

              {/* Stats */}
              <View className="flex-row bg-white/20 rounded-xl px-6 py-3 mt-2">
                <View className="items-center px-4">
                  <Text className="text-white text-2xl font-bold">
                    {user?.interests?.length || 0}
                  </Text>
                  <Text className="text-white/90 text-xs">Interests</Text>
                </View>
                <View className="w-px bg-white/30 mx-2" />
                <View className="items-center px-4">
                  <Text className="text-white text-2xl font-bold">
                    {pet ? "1" : "0"}
                  </Text>
                  <Text className="text-white/90 text-xs">Pets</Text>
                </View>
                <View className="w-px bg-white/30 mx-2" />
                <View className="items-center px-4">
                  <Text className="text-white text-2xl font-bold">0</Text>
                  <Text className="text-white/90 text-xs">Matches</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Content */}
          <View className="px-6 -mt-6">
            {/* Quick Actions Card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
              <View className="flex-row justify-around">
                <TouchableOpacity
                  className="items-center flex-1"
                  onPress={() => navigation.navigate("UserProfileSetup" as never)}
                >
                  <View className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-2">
                    <Ionicons name="create-outline" size={24} color="#10B981" />
                  </View>
                  <Text className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                    Edit Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center flex-1"
                  onPress={() => navigation.navigate("Settings" as never)}
                >
                  <View className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mb-2">
                    <Ionicons name="settings-outline" size={24} color="#3B82F6" />
                  </View>
                  <Text className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                    Settings
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center flex-1"
                  onPress={handleLogout}
                >
                  <View className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-2">
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                  </View>
                  <Text className="text-gray-700 dark:text-gray-300 text-xs font-medium">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* About Me Section */}
            <View className="mb-6">
              <SectionHeader
                icon="person-outline"
                title="About Me"
                onEdit={() => navigation.navigate("UserProfileSetup" as never)}
              />

              {user?.bio ? (
                <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-3">
                  <Text className="text-gray-800 dark:text-gray-200 leading-6">
                    {user.bio}
                  </Text>
                </View>
              ) : (
                <View className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 mb-3">
                  <Text className="text-yellow-800 dark:text-yellow-300 text-sm">
                    ℹ️ Add a bio to tell others about yourself
                  </Text>
                </View>
              )}

              <InfoCard
                icon="mail-outline"
                label="Email"
                value={user?.email || ""}
                iconColor="#3B82F6"
              />

              {user?.contactInfo && (
                <InfoCard
                  icon="call-outline"
                  label="Contact"
                  value={user.contactInfo}
                  iconColor="#8B5CF6"
                />
              )}
            </View>

            {/* Interests Section */}
            {user?.interests && user.interests.length > 0 && (
              <View className="mb-6">
                <SectionHeader
                  icon="heart-outline"
                  title="My Interests"
                  onEdit={() => navigation.navigate("UserProfileSetup" as never)}
                />
                <View className="flex-row flex-wrap">
                  {user.interests.map((interest, index) => (
                    <InterestChip key={index} text={interest} />
                  ))}
                </View>
              </View>
            )}

            {/* Pet Profile Section */}
            <View className="mb-6">
              <SectionHeader
                icon="paw-outline"
                title="My Pet"
                onEdit={
                  pet
                    ? () => navigation.navigate("PetProfileSetup" as never)
                    : undefined
                }
              />

              {pet ? (
                <View className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  {/* Pet Image/Icon */}
                  <View className="items-center mb-4">
                    <View className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 items-center justify-center shadow-lg">
                      {pet.imageUrl ? (
                        <Image
                          source={{ uri: pet.imageUrl }}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <Ionicons name="paw" size={48} color="#10B981" />
                      )}
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                      {pet.petName}
                    </Text>
                    {pet.breed && (
                      <Text className="text-gray-600 dark:text-gray-400 text-sm">
                        {pet.breed}
                      </Text>
                    )}
                  </View>

                  {/* Pet Details Grid */}
                  <View className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
                    <View className="flex-row justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <View className="flex-row items-center">
                        <Ionicons name="male-female-outline" size={18} color="#10B981" />
                        <Text className="ml-2 text-gray-600 dark:text-gray-400">Gender</Text>
                      </View>
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        {pet.gender || "Not specified"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={18} color="#10B981" />
                        <Text className="ml-2 text-gray-600 dark:text-gray-400">Age</Text>
                      </View>
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        {pet.age ? `${pet.age} years` : "Not specified"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <View className="flex-row items-center">
                        <Ionicons name="speedometer-outline" size={18} color="#10B981" />
                        <Text className="ml-2 text-gray-600 dark:text-gray-400">Weight</Text>
                      </View>
                      <Text className="text-gray-900 dark:text-white font-semibold">
                        {pet.weight ? `${pet.weight} kg` : "Not specified"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center py-2">
                      <View className="flex-row items-center">
                        <Ionicons name="medkit-outline" size={18} color="#10B981" />
                        <Text className="ml-2 text-gray-600 dark:text-gray-400">Vaccinated</Text>
                      </View>
                      <View className={`px-3 py-1 rounded-full ${
                        pet.vaccinated
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}>
                        <Text className={`font-semibold text-xs ${
                          pet.vaccinated
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}>
                          {pet.vaccinated ? "Yes ✓" : "No ✗"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate("PetProfileSetup" as never)}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-2 border-dashed border-green-300 dark:border-green-700 items-center"
                >
                  <Ionicons name="add-circle-outline" size={64} color="#10B981" />
                  <Text className="text-gray-900 dark:text-white font-bold text-lg mt-4 mb-2">
                    Add Your Pet
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center">
                    Create a profile for your furry friend to start finding matches!
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Account Info Card */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-8">
              <Text className="text-gray-500 dark:text-gray-400 text-xs mb-2">
                ACCOUNT INFORMATION
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-700 dark:text-gray-300">Member Since</Text>
                  <Text className="text-gray-900 dark:text-white font-semibold">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-700 dark:text-gray-300">Account Status</Text>
                  <View className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                    <Text className="text-green-700 dark:text-green-300 font-semibold text-xs">
                      Active
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </NavLayout>
  );
}