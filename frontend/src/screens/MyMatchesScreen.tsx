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
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');



export default function MyMatchesScreen() {
  const [activeTab, setActiveTab] = useState('matches');

  const matches = [
    { id: '1', name: 'Luna', breed: 'Husky', image: '🐺', lastMessage: 'Hey! Let\'s meet at the park!', time: '2h ago', unread: 2 },
    { id: '2', name: 'Charlie', breed: 'Beagle', image: '🐕', lastMessage: 'That sounds great!', time: '5h ago', unread: 0 },
    { id: '3', name: 'Bella', breed: 'Poodle', image: '🐩', lastMessage: 'Is Saturday good for you?', time: '1d ago', unread: 1 }
  ];

  const likes = [
    { id: '4', name: 'Rocky', breed: 'Bulldog', image: '🐶', distance: '3.2 km' },
    { id: '5', name: 'Daisy', breed: 'Labrador', image: '🦮', distance: '1.5 km' }
  ];

  return (
    <View className="flex-1 bg-gray-50">

      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <Text className="text-3xl font-bold text-gray-900 mb-4">Matches</Text>
        
        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('matches')}
            className={`flex-1 py-2 rounded-lg ${activeTab === 'matches' ? 'bg-pink-500' : 'bg-transparent'}`}
          >
            <Text className={`text-center font-bold ${activeTab === 'matches' ? 'text-white' : 'text-gray-600'}`}>
              Matches ({matches.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('likes')}
            className={`flex-1 py-2 rounded-lg ${activeTab === 'likes' ? 'bg-pink-500' : 'bg-transparent'}`}
          >
            <Text className={`text-center font-bold ${activeTab === 'likes' ? 'text-white' : 'text-gray-600'}`}>
              Likes ({likes.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-4">
        {activeTab === 'matches' ? (
          matches.map((match) => (
            <TouchableOpacity
              key={match.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center"
            >
              <View className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full items-center justify-center mr-4">
                <Text className="text-4xl">{match.image}</Text>
              </View>
              
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-lg font-bold text-gray-900">{match.name}</Text>
                  <Text className="text-gray-500 text-sm">{match.time}</Text>
                </View>
                <Text className="text-gray-600 text-sm mb-1">{match.breed}</Text>
                <Text className="text-gray-500" numberOfLines={1}>{match.lastMessage}</Text>
              </View>

              {match.unread > 0 && (
                <View className="bg-pink-500 w-6 h-6 rounded-full items-center justify-center ml-2">
                  <Text className="text-white text-xs font-bold">{match.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          likes.map((like) => (
            <View key={like.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row items-center">
              <View className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full items-center justify-center mr-4">
                <Text className="text-4xl">{like.image}</Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{like.name}</Text>
                <Text className="text-gray-600 text-sm">{like.breed}</Text>
                <Text className="text-gray-500 text-sm">{like.distance} away</Text>
              </View>

              <TouchableOpacity className="bg-pink-500 px-4 py-2 rounded-full">
                <Text className="text-white font-bold">Message</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

