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



export default function MessagesScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi! Max would love to meet Luna!', sender: 'me', time: '10:30 AM' },
    { id: '2', text: 'That sounds great! How about this Saturday?', sender: 'them', time: '10:32 AM' },
    { id: '3', text: 'Perfect! Central Park at 3 PM?', sender: 'me', time: '10:35 AM' },
    { id: '4', text: 'See you there! 🐾', sender: 'them', time: '10:36 AM' }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm flex-row items-center">
        <TouchableOpacity className="mr-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        
        <View className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full items-center justify-center mr-3">
          <Text className="text-2xl">🐺</Text>
        </View>
        
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900">Luna & Sarah</Text>
          <Text className="text-gray-600 text-sm">Active now</Text>
        </View>

        <TouchableOpacity>
          <Text className="text-2xl">⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-4 pt-4">
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-3 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-3/4 px-4 py-3 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-pink-500 rounded-tr-none'
                  : 'bg-white rounded-tl-none shadow-sm'
              }`}
            >
              <Text className={msg.sender === 'me' ? 'text-white' : 'text-gray-900'}>
                {msg.text}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1 px-2">{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View className="bg-white px-4 py-3 border-t border-gray-200 flex-row items-center">
        <TouchableOpacity className="mr-3">
          <Text className="text-2xl">📷</Text>
        </TouchableOpacity>
        
        <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex-row items-center">
          <TextInput
            className="flex-1 text-gray-900"
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity
          onPress={sendMessage}
          className="ml-3 bg-pink-500 w-10 h-10 rounded-full items-center justify-center"
        >
          <Text className="text-white text-xl">➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

