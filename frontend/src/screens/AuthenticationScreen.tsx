import React, { useState, useEffect, useRef, use } from 'react';
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
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import useAuthStore from '../state/authStore';

// Import your auth store
// import { useAuthStore } from '@/store/authStore';

// Types
interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthenticationScreen: React.FC = () => {
  // Navigation
  const navigation = useNavigation();

  // Auth Store - uncomment when integrated
  // const { login, register, isLoading } = useAuthStore();

  // Local State
  const [isLogin, setIsLogin] = useState<boolean>(true);
  // isLoggedIn : isLogin
  const {login, register } = useAuthStore();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for background shapes
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Email validation helper
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Toggle between login and register
  const toggleAuthMode = (): void => {
    setIsLogin(!isLogin);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation (for registration)
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login
  const handleLogin = async (): Promise<void> => {
    console.log(`🔐 Login attempt for email: ${email}`);
    
    // Clear previous errors
    setErrors({});

    // Validation
    const newErrors: ValidationErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // If there are errors, show them
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      // TODO: Replace with actual auth store login
      // const result = await login(email.toLowerCase().trim(), password);
      
      // Simulate API call for demo
      const result = await login(email.toLowerCase().trim(), password);
      // const result = await mockLoginAPI(email.toLowerCase().trim(), password);

      console.log('🔄 Login result:', result);

      if (result.error) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: result.error || 'Please check your credentials.',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back! 👋',
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate to Profile Setup or Home
      // navigation.navigate('ProfileSetup' as never);
      
    } catch (error) {
      console.error('❌ Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'An unexpected error occurred. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (): Promise<void> => {
    console.log(`📝 Registration attempt for email: ${email}`);
    
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      // TODO: Replace with actual auth store register
      // const result = await register(email.toLowerCase().trim(), password);
      
      // Simulate API call for demo
      const result = await register(email.toLowerCase().trim(), password);
      // const result = await mockRegisterAPI(email.toLowerCase().trim(), password);

      console.log('🔄 Registration result:', result);

      if (result.error) {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error || 'Unable to create account.',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Welcome to PetMatch! 🐾',
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate to Profile Setup
      // navigation.navigate('ProfileSetup' as never);
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: 'An unexpected error occurred. Please try again.',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit handler
  const handleSubmit = async (): Promise<void> => {
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-gray-900">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Enhanced Animated Background Pattern */}
      <View className="absolute inset-0">
        <LinearGradient
          colors={['#667EEA', '#764BA2', '#F093FB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        />
        
        {/* Animated background shapes with floating effect */}
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim }],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          }}
          className="absolute top-10 left-5 w-40 h-40 bg-white/20 rounded-full"
        />
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim.interpolate({
              inputRange: [-10, 0],
              outputRange: [0, -10],
            })}],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          }}
          className="absolute top-32 right-8 w-32 h-32 bg-white/15 rounded-full"
        />
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim }],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
          }}
          className="absolute bottom-40 left-10 w-36 h-36 bg-white/25 rounded-full"
        />
        <Animated.View
          style={{
            transform: [{ translateY: floatAnim.interpolate({
              inputRange: [-10, 0],
              outputRange: [0, -10],
            })}],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          }}
          className="absolute bottom-20 right-5 w-28 h-28 bg-white/20 rounded-full"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        >
          {/* Enhanced App Header */}
          <View className="pt-20 pb-8 px-6">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
              className="items-center"
            >
              {/* Logo with glow effect */}
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <View className="relative">
                  {/* Glow */}
                  <View className="absolute inset-0 w-28 h-28 bg-white/30 rounded-full blur-2xl" />
                  {/* Logo */}
                  <View className="w-28 h-28 bg-white/25 backdrop-blur-xl rounded-full items-center justify-center mb-5 shadow-2xl border-4 border-white/40">
                    <Text className="text-6xl">🐾</Text>
                  </View>
                </View>
              </Animated.View>
              <Text className="text-5xl font-extrabold text-white mb-2 tracking-tight">
                PetMatch
              </Text>
              <View className="bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 border border-white/30">
                <Text className="text-white text-center text-base font-semibold">
                  Find the perfect companion for your pet
                </Text>
              </View>
            </Animated.View>
          </View>

          {/* Enhanced Auth Form Card */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="px-6"
          >
            <View className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/50 dark:border-gray-700/50 overflow-hidden">
              {/* Enhanced Toggle Header */}
              <View className="flex-row bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <Pressable
                  onPress={() => !isLogin && toggleAuthMode()}
                  className={`flex-1 py-4 ${isLogin ? 'border-b-4 border-blue-500' : ''}`}
                >
                  <Text className={`text-center font-bold text-lg ${isLogin ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    Login
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => isLogin && toggleAuthMode()}
                  className={`flex-1 py-4 ${!isLogin ? 'border-b-4 border-purple-500' : ''}`}
                >
                  <Text className={`text-center font-bold text-lg ${!isLogin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    Register
                  </Text>
                </Pressable>
              </View>

              {/* Form Content */}
              <View className="p-6">
                {/* Email Input */}
                <View className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                    Email Address
                  </Text>
                  <View className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}>
                    <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">📧</Text>
                    <TextInput
                      className="flex-1 text-gray-900 dark:text-white text-base"
                      placeholder="your@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setErrors({ ...errors, email: undefined });
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!isLoading}
                    />
                  </View>
                  {errors.email && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Text className="text-red-500 text-sm font-medium">
                        ⚠️ {errors.email}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Password Input */}
                <View className="mb-5">
                  <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                    Password
                  </Text>
                  <View className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}>
                    <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">🔒</Text>
                    <TextInput
                      className="flex-1 text-gray-900 dark:text-white text-base"
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        setErrors({ ...errors, password: undefined });
                      }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      className="ml-2 p-1"
                    >
                      <Text className="text-gray-500 dark:text-gray-400 text-lg">
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Text className="text-red-500 text-sm font-medium">
                        ⚠️ {errors.password}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Confirm Password Input (Register Only) */}
                {!isLogin && (
                  <View className="mb-5">
                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-2 text-base">
                      Confirm Password
                    </Text>
                    <View className={`flex-row items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3.5 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'}`}>
                      <Text className="text-gray-400 dark:text-gray-500 mr-3 text-xl">🔐</Text>
                      <TextInput
                        className="flex-1 text-gray-900 dark:text-white text-base"
                        placeholder="Confirm your password"
                        placeholderTextColor="#9CA3AF"
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                      <TouchableOpacity 
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="ml-2 p-1"
                      >
                        <Text className="text-gray-500 dark:text-gray-400 text-lg">
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <View className="flex-row items-center mt-2 ml-1">
                        <Text className="text-red-500 text-sm font-medium">
                          ⚠️ {errors.confirmPassword}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Forgot Password (Login Only) */}
                {isLogin && (
                  <TouchableOpacity className="mb-6" disabled={isLoading}>
                    <Text className="text-blue-600 dark:text-blue-400 text-right font-semibold">
                      Forgot Password? →
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Enhanced Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className="overflow-hidden rounded-xl shadow-2xl mt-2"
                  activeOpacity={0.85}
                  style={{
                    elevation: 8,
                    shadowColor: isLogin ? '#3B82F6' : '#9333EA',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }}
                >
                  <LinearGradient
                    colors={isLogin ? ['#3B82F6', '#2563EB'] : ['#9333EA', '#7E22CE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-4 px-6"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white text-center font-extrabold text-lg tracking-wide">
                        {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                      </Text>
                      {!isLoading && (
                        <Text className="text-white text-xl ml-2">
                          {isLogin ? '🔓' : '🚀'}
                        </Text>
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms and Conditions (Register Only) */}
                {!isLogin && (
                  <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mt-4 leading-5">
                    By registering, you agree to our{' '}
                    <Text className="text-blue-600 dark:text-blue-400 font-bold">Terms of Service</Text>
                    {' '}and{' '}
                    <Text className="text-blue-600 dark:text-blue-400 font-bold">Privacy Policy</Text>
                  </Text>
                )}
              </View>
            </View>

            {/* Enhanced Social Login Options */}
            <View className="mt-8">
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-white/30" />
                <Text className="text-white/90 mx-4 font-semibold text-sm">Or continue with</Text>
                <View className="flex-1 h-px bg-white/30" />
              </View>

              <View className="flex-row justify-center">
                <TouchableOpacity 
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl p-4 shadow-xl border-2 border-white/50 dark:border-gray-700/50 flex-1 mr-2"
                  disabled={isLoading}
                  style={{
                    elevation: 6,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-2xl mr-2">🔵</Text>
                    <Text className="text-gray-700 dark:text-gray-300 font-bold">Google</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl p-4 shadow-xl border-2 border-white/50 dark:border-gray-700/50 flex-1 ml-2"
                  disabled={isLoading}
                  style={{
                    elevation: 6,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-2xl mr-2">📘</Text>
                    <Text className="text-gray-700 dark:text-gray-300 font-bold">Facebook</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Footer */}
            <View className="mt-8 mb-6">
              <View className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-white/50 dark:border-gray-700/50">
                <View className="flex-row items-center justify-around">
                  <View className="items-center">
                    <View className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-2 shadow-lg">
                      <Text className="text-green-600 dark:text-green-400 font-bold text-xl">🔒</Text>
                    </View>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 font-bold">Secure</Text>
                  </View>

                  <View className="items-center">
                    <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full items-center justify-center mb-2 shadow-lg">
                      <Text className="text-purple-600 dark:text-purple-400 font-bold text-xl">🔐</Text>
                    </View>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 font-bold">Encrypted</Text>
                  </View>

                  <View className="items-center">
                    <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-2 shadow-lg">
                      <Text className="text-blue-600 dark:text-blue-400 font-bold text-xl">✓</Text>
                    </View>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 font-bold">Verified</Text>
                  </View>

                  <View className="items-center">
                    <View className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full items-center justify-center mb-2 shadow-lg">
                      <Text className="text-orange-600 dark:text-orange-400 font-bold text-xl">⚡</Text>
                    </View>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 font-bold">Fast</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/60 items-center justify-center z-50">
          <View className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            <Text className="text-gray-900 dark:text-white font-extrabold text-xl mb-4 text-center">
              {isLogin ? 'Logging in...' : 'Creating account...'}
            </Text>
            <View className="items-center">
              <Text className="text-5xl mb-2">⏳</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">Please wait</Text>
            </View>
          </View>
        </View>
      )}

      {/* Toast Message Container */}
      <Toast />
    </View>
  );
};

// Mock API functions (replace with actual API calls)
interface AuthResponse {
  success?: boolean;
  error?: string;
  token?: string;
  user?: any;
}

const mockLoginAPI = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (email === 'test@example.com' && password === 'password123') {
    return {
      success: true,
      token: 'mock-jwt-token',
      user: { id: 1, email, name: 'Test User' }
    };
  }
  
  return {
    error: 'Invalid email or password'
  };
};

const mockRegisterAPI = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (email.includes('@')) {
    return {
      success: true,
      token: 'mock-jwt-token',
      user: { id: 2, email, name: 'New User' }
    };
  }
  
  return {
    error: 'Registration failed. Please try again.'
  };
};

export default AuthenticationScreen;