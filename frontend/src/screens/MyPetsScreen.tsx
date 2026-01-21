// src/screens/MyPetsScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StatusBar,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import NavLayout from "../components/Navbar/NavLayout";

// ============================================
// Types
// ============================================

interface Pet {
  _id: string;
  petName: string;
  breed: string;
  gender: "male" | "female";
  age: number;
  weight: number;
  vaccinated: boolean;
  imageUrl?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Pet[];
  message?: string;
}

// ============================================
// Main Component
// ============================================

const MyPetsScreen: React.FC = () => {
  const navigation = useNavigation();

  // State
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState({
    petName: "",
    breed: "",
    age: "",
    weight: "",
  });

  // ============================================
  // Fetch Pets from Backend
  // ============================================

  const fetchPets = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse>("/pet"); // GET /api/pet

      if (response.data.success) {
        setPets(response.data.data);
      } else {
        Alert.alert("Error", response.data.message || "Failed to fetch pets");
      }
    } catch (error: any) {
      console.error("Error fetching pets:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to load pets. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // Pull to Refresh
  // ============================================

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPets();
    setIsRefreshing(false);
  }, [fetchPets]);

  // ============================================
  // Delete Pet
  // ============================================

  const handleDeletePet = useCallback((pet: Pet) => {
    Alert.alert(
      "Delete Pet",
      `Are you sure you want to delete ${pet.petName}? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.delete(`/pet/${pet._id}`);

              if (response.data.success) {
                // Remove pet from local state
                setPets((prevPets) =>
                  prevPets.filter((p) => p._id !== pet._id),
                );
                Alert.alert(
                  "Success",
                  `${pet.petName} has been deleted successfully`,
                );
              }
            } catch (error: any) {
              console.error("Error deleting pet:", error);
              const errorMessage =
                error.response?.data?.message || "Failed to delete pet";
              Alert.alert("Error", errorMessage);
            }
          },
        },
      ],
    );
  }, []);

  // ============================================
  // Edit Pet - Open Modal
  // ============================================

  const handleEditPet = useCallback((pet: Pet) => {
    setSelectedPet(pet);
    setEditFormData({
      petName: pet.petName,
      breed: pet.breed,
      age: pet.age.toString(),
      weight: pet.weight.toString(),
    });
    setShowEditModal(true);
  }, []);

  // ============================================
  // Save Edited Pet
  // ============================================

  const handleSaveEdit = useCallback(async () => {
    if (!selectedPet) return;

    // Validation
    if (!editFormData.petName.trim()) {
      Alert.alert("Validation Error", "Pet name is required");
      return;
    }
    if (!editFormData.breed.trim()) {
      Alert.alert("Validation Error", "Breed is required");
      return;
    }
    if (!editFormData.age || isNaN(Number(editFormData.age))) {
      Alert.alert("Validation Error", "Please enter a valid age");
      return;
    }
    if (!editFormData.weight || isNaN(Number(editFormData.weight))) {
      Alert.alert("Validation Error", "Please enter a valid weight");
      return;
    }

    try {
      const response = await api.put(`/pet/${selectedPet._id}`, {
        petName: editFormData.petName.trim(),
        breed: editFormData.breed.trim(),
        age: Number(editFormData.age),
        weight: Number(editFormData.weight),
      });

      if (response.data.success) {
        // Update local state
        setPets((prevPets) =>
          prevPets.map((p) =>
            p._id === selectedPet._id ? { ...p, ...response.data.data } : p,
          ),
        );
        setShowEditModal(false);
        Alert.alert("Success", "Pet profile updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating pet:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update pet";
      Alert.alert("Error", errorMessage);
    }
  }, [selectedPet, editFormData]);

  // ============================================
  // Initial Load
  // ============================================

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // ============================================
  // Render Pet Card
  // ============================================

  const renderPetCard = (pet: Pet) => {
    const genderColor = pet.gender === "male" ? "#3B82F6" : "#EC4899";
    const genderIcon = pet.gender === "male" ? "♂️" : "♀️";

    return (
      <View
        key={pet._id}
        className="mb-4 rounded-3xl overflow-hidden shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <LinearGradient
          colors={["#F093FB", "#F5576C", "#FD8451"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-1"
        >
          <View className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden">
            {/* Pet Header with Image Placeholder */}
            <LinearGradient
              colors={
                pet.gender === "male"
                  ? ["#60A5FA", "#3B82F6"]
                  : ["#F472B6", "#EC4899"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-40 items-center justify-center"
            >
              <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center backdrop-blur-lg overflow-hidden">
                {pet.imageUrl ? (
                  <Image
                    source={{ uri: pet.imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-7xl">
                    {pet.gender === "male" ? "🐕" : "🐩"}
                  </Text>
                )}
              </View>

              {/* Vaccination Badge */}
              <View className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex-row items-center">
                {pet.vaccinated ? (
                  <>
                    <Text className="text-lg mr-1">💉</Text>
                    <Text className="text-green-600 font-bold text-xs">
                      Vaccinated
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-lg mr-1">⚠️</Text>
                    <Text className="text-red-600 font-bold text-xs">
                      Not Vaccinated
                    </Text>
                  </>
                )}
              </View>
            </LinearGradient>

            {/* Pet Information */}
            <View className="p-5">
              {/* Name and Gender */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {pet.petName}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-base">
                    {pet.breed}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${genderColor}20` }}
                >
                  <Text style={{ color: genderColor }} className="font-bold">
                    {genderIcon}{" "}
                    {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Stats Row */}
              <View className="flex-row justify-between mb-4">
                <View className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl flex-1 mr-2">
                  <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
                    Age
                  </Text>
                  <Text className="text-blue-900 dark:text-blue-300 font-bold text-lg">
                    {pet.age} {pet.age === 1 ? "year" : "years"}
                  </Text>
                </View>
                <View className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl flex-1 ml-2">
                  <Text className="text-purple-600 dark:text-purple-400 text-xs font-semibold mb-1">
                    Weight
                  </Text>
                  <Text className="text-purple-900 dark:text-purple-300 font-bold text-lg">
                    {pet.weight} kg
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => handleEditPet(pet)}
                  className="flex-1 overflow-hidden rounded-xl"
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#60A5FA", "#3B82F6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3 flex-row items-center justify-center"
                  >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text className="text-white font-bold ml-2">Edit</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeletePet(pet)}
                  className="flex-1 overflow-hidden rounded-xl"
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3 flex-row items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                    <Text className="text-white font-bold ml-2">Delete</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Timestamp */}
              <Text className="text-gray-400 text-xs text-center mt-3">
                Added {new Date(pet.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  // ============================================
  // Render Edit Modal
  // ============================================

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEditModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="bg-white dark:bg-gray-800 rounded-t-3xl p-6"
          style={{ maxHeight: "80%" }}
        >
          {/* Modal Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Pet Profile
            </Text>
            <TouchableOpacity
              onPress={() => setShowEditModal(false)}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pet Name */}
            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Pet Name *
              </Text>
              <TextInput
                className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-900 dark:text-white"
                placeholder="Enter pet name"
                placeholderTextColor="#9CA3AF"
                value={editFormData.petName}
                onChangeText={(text) =>
                  setEditFormData({ ...editFormData, petName: text })
                }
              />
            </View>

            {/* Breed */}
            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Breed *
              </Text>
              <TextInput
                className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-900 dark:text-white"
                placeholder="Enter breed"
                placeholderTextColor="#9CA3AF"
                value={editFormData.breed}
                onChangeText={(text) =>
                  setEditFormData({ ...editFormData, breed: text })
                }
              />
            </View>

            {/* Age */}
            <View className="mb-4">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Age (years) *
              </Text>
              <TextInput
                className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-900 dark:text-white"
                placeholder="Enter age"
                placeholderTextColor="#9CA3AF"
                value={editFormData.age}
                onChangeText={(text) =>
                  setEditFormData({ ...editFormData, age: text })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Weight */}
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                Weight (kg) *
              </Text>
              <TextInput
                className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl text-gray-900 dark:text-white"
                placeholder="Enter weight"
                placeholderTextColor="#9CA3AF"
                value={editFormData.weight}
                onChangeText={(text) =>
                  setEditFormData({ ...editFormData, weight: text })
                }
                keyboardType="numeric"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveEdit}
              className="overflow-hidden rounded-xl mb-4"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 items-center"
              >
                <Text className="text-white font-bold text-lg">
                  Save Changes
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // ============================================
  // Main Render
  // ============================================

  return (
    <NavLayout title="My Pets">
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <LinearGradient
          colors={["#F093FB", "#F5576C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-6 pt-4 pb-6"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-white mb-1">
                My Pets
              </Text>
              <Text className="text-white/90">Manage your pet profiles</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PetProfileCreationScreen" as never)
              }
              className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full flex-row items-center"
            >
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-bold ml-1">Add Pet</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#F5576C" />
            <Text className="text-gray-600 dark:text-gray-400 mt-4">
              Loading your pets...
            </Text>
          </View>
        ) : pets.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-full items-center justify-center mb-6">
              <Text className="text-7xl">🐾</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Pets Yet
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
              Start by adding your first pet profile
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("PetProfileSetup" as never)}
              className="overflow-hidden rounded-xl"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#F093FB", "#F5576C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="px-6 py-3 flex-row items-center"
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  Add Your First Pet
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={["#F5576C"]}
                tintColor="#F5576C"
              />
            }
          >
            {pets.map(renderPetCard)}
            <View className="h-6" />
          </ScrollView>
        )}

        {/* Edit Modal */}
        {renderEditModal()}
      </View>
    </NavLayout>
  );
};

export default MyPetsScreen;
