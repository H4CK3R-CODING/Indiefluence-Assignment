import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Animated,
  Dimensions,
  FlatList,
  StatusBar
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FindMatchesScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({
    breed: '',
    ageMin: '',
    ageMax: '',
    gender: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const mockPets = [
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'male',
      distance: 2.5,
      image: '🦮',
      bio: 'Loves long walks and playing fetch!',
      owner: 'Sarah',
      vaccinated: true
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Husky',
      age: 2,
      gender: 'female',
      distance: 5.2,
      image: '🐺',
      bio: 'Energetic and loves the snow!',
      owner: 'Mike',
      vaccinated: true
    },
    {
      id: '3',
      name: 'Charlie',
      breed: 'Beagle',
      age: 4,
      gender: 'male',
      distance: 1.8,
      image: '🐕',
      bio: 'Friendly and great with kids!',
      owner: 'Emma',
      vaccinated: true
    }
  ];

  const currentPet = mockPets[currentIndex];

  const handleSwipe = (direction : string) => {
    if (direction === 'right') {
      alert(`You liked ${currentPet?.name}! 💚`);
    } else {
      alert(`You passed on ${currentPet?.name}`);
    }
    
    if (currentIndex < mockPets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Reset to beginning
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-900">Discover</Text>
          <TouchableOpacity 
            onPress={() => setShowFilters(!showFilters)}
            className="bg-pink-100 p-2 rounded-full"
          >
            <Text className="text-xl">⚙️</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600">Find the perfect match for your pet</Text>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-3">Filters</Text>
          
          <View className="flex-row space-x-2 mb-3">
            {['all', 'male', 'female'].map((gender) => (
              <TouchableOpacity
                key={gender}
                onPress={() => setFilters({ ...filters, gender })}
                className={`px-4 py-2 rounded-full ${
                  filters.gender === gender ? 'bg-pink-500' : 'bg-gray-200'
                }`}
              >
                <Text className={`font-semibold ${
                  filters.gender === gender ? 'text-white' : 'text-gray-700'
                }`}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Pet Card */}
      <View className="flex-1 px-4 pt-6">
        {currentPet ? (
          <View className="bg-white rounded-3xl shadow-2xl overflow-hidden h-5/6">
            {/* Pet Image */}
            <View className="bg-gradient-to-br from-purple-400 to-pink-400 h-3/5 items-center justify-center">
              <Text className="text-9xl">{currentPet.image}</Text>
              <View className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                <Text className="text-pink-500 font-bold">{currentPet.distance} km away</Text>
              </View>
            </View>

            {/* Pet Info */}
            <ScrollView className="flex-1 p-6">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-3xl font-bold text-gray-900">{currentPet.name}</Text>
                  <Text className="text-gray-600 text-lg">{currentPet.breed} • {currentPet.age} years old</Text>
                </View>
                <View className="bg-pink-100 px-3 py-1 rounded-full">
                  <Text className="text-pink-600 font-semibold">
                    {currentPet.gender === 'male' ? '♂️ Male' : '♀️ Female'}
                  </Text>
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-gray-700 leading-6">{currentPet.bio}</Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Text className="text-gray-600">Owner: </Text>
                <Text className="text-gray-900 font-semibold">{currentPet.owner}</Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-2xl mr-2">💉</Text>
                <Text className="text-green-600 font-semibold">Fully Vaccinated</Text>
              </View>
            </ScrollView>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl">🎉</Text>
            <Text className="text-gray-600 text-lg mt-2">No more pets to show</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-center space-x-6 py-6 bg-white">
        <TouchableOpacity
          onPress={() => handleSwipe('left')}
          className="bg-gray-200 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-3xl">✕</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-100 w-16 h-16 rounded-full items-center justify-center shadow-lg">
          <Text className="text-3xl">⭐</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSwipe('right')}
          className="bg-pink-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-3xl">💚</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
