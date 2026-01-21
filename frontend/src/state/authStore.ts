// src/state/authStore.ts
// Paw-fect Match - Authentication Store
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse, AxiosError } from "axios";
import Toast from "react-native-toast-message";

// ============================================
// Types & Interfaces (Matching Backend Schema)
// ============================================

export interface User {
  _id?: string;
  email: string;
  name?: string;
  bio?: string;
  interests?: string[];
  contactInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pet {
  _id?: string;
  userId: string;
  petName: string;
  breed?: string;
  gender?: "Male" | "Female";
  age?: number;
  weight?: number;
  vaccinated?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface StoredAuthData extends AuthData {
  isLoggedIn?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface UserProfileData {
  name?: string;
  bio?: string;
  interests?: string[];
  contactInfo?: string;
}

export interface PetProfileData {
  petName: string;
  breed: string;
  gender: "Male" | "Female" | "";
  age: number | null;
  weight: number | null;
  vaccinated: boolean | null;
  imageUrl?: string;
}

// interface PetProfileData {
//   petName: string;
//   breed: string;
//   gender: "male" | "female" | "";
//   age: string;
//   weight: string;
//   vaccinated: "yes" | "no" | "";
//   imageUri?: string;
// }

// Backend API Response Structures
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    userId?: string;
  };
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface PetResponse {
  success: boolean;
  data: Pet;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface AuthState {
  user: User | null;
  pet: Pet | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
}

// ============================================
// API Configuration
// ============================================

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Token will be added per request in store methods
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - handled in store
      console.warn("⚠️ Unauthorized request - token may be invalid");
    }
    return Promise.reject(error);
  }
);

// ============================================
// Store Interface
// ============================================

interface AuthStore extends AuthState {
  // Auth methods
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  
  // User profile methods
  createOrUpdateUserProfile: (profileData: UserProfileData) => Promise<AuthResult>;
  getUserProfile: () => Promise<AuthResult>;
  
  // Pet profile methods
  createPetProfile: (petData: PetProfileData) => Promise<AuthResult>;
  getPetProfile: () => Promise<AuthResult>;
  
  // Utility methods
  checkTokenExpiry: (token: string) => boolean;
  getAuthState: () => AuthState;
}

// ============================================
// Zustand Store - Paw-fect Match
// ============================================

const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial State
  user: null,
  pet: null,
  isLoggedIn: false,
  isLoading: true,
  token: null,

  // ============================================
  // Initialize - Check AsyncStorage on app start
  // ============================================
  initialize: async (): Promise<void> => {
    try {
      set({ isLoading: true });

      const storedAuth = await AsyncStorage.getItem("authData");
      console.log("📦 Checking stored auth data...");

      if (storedAuth && storedAuth !== "undefined" && storedAuth !== "null") {
        const authData: StoredAuthData = JSON.parse(storedAuth);

        // Validate token
        const isTokenValid = get().checkTokenExpiry(authData.token);

        if (isTokenValid && authData.token) {
          // Auto-login with stored data
          set({
            user: authData.user,
            token: authData.token,
            isLoggedIn: true,
            isLoading: false,
          });

          // Try to fetch latest user data
          try {
            await get().getUserProfile();
            await get().getPetProfile();
          } catch (error) {
            console.warn("⚠️ Failed to fetch user/pet data on init");
          }

          console.log("✅ Auto-login successful:", authData.user.email);
        } else {
          // Token expired or invalid
          await get().logout();
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
        console.log("ℹ️ No stored authentication found");
      }
    } catch (error) {
      console.error("❌ Initialize error:", error);
      set({ isLoading: false });
    }
  },

  // ============================================
  // Login - POST /auth/login
  // ============================================
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      set({ isLoading: true });
      console.log(`🔐 Attempting login for: ${email}`);

      const response: AxiosResponse<AuthResponse> = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, userId } = response.data.data;

      // Save token and basic auth data
      const authData: StoredAuthData = {
        user: {  email, _id: userId },
        // ...get().user,
        token,
        isLoggedIn: true,
      };

      await AsyncStorage.setItem("authData", JSON.stringify(authData));

      // Update state
      set({
        token,
        isLoggedIn: true,
      });

      // Fetch full user profile
      try {
        await get().getUserProfile();
        await get().getPetProfile();
      } catch (error) {
        console.warn("⚠️ Could not fetch profile data");
      }

      set({ isLoading: false });

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back! 🐾",
        position: "top",
        visibilityTime: 3000,
      });

      console.log("✅ Login successful");
      return { success: true };

    } catch (error) {
      set({ isLoading: false });
      
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 
        "Login failed. Please check your credentials.";

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: errorMessage,
        position: "top",
        visibilityTime: 3000,
      });

      console.error("❌ Login error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // ============================================
  // Register - POST /auth/register
  // ============================================
  register: async (email: string, password: string): Promise<AuthResult> => {
    try {
      set({ isLoading: true });
      console.log(`📝 Attempting registration for: ${email}`);

      const response: AxiosResponse<AuthResponse> = await api.post("/auth/register", {
        email,
        password,
      });

      set({ isLoading: false });

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Please login to continue! 🎉",
        position: "top",
        visibilityTime: 3000,
      });

      console.log("✅ Registration successful");
      return { success: true };

    } catch (error) {
      set({ isLoading: false });
      
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 
        "Registration failed. Please try again.";

      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: errorMessage,
        position: "top",
        visibilityTime: 3000,
      });

      console.error("❌ Registration error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // ============================================
  // Logout
  // ============================================
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("authData");

      set({
        user: null,
        pet: null,
        token: null,
        isLoggedIn: false,
      });

      Toast.show({
        type: "success",
        text1: "Logged Out",
        text2: "See you again! 👋",
        position: "top",
        visibilityTime: 2000,
      });

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  },

  // ============================================
  // Create/Update User Profile - POST /user
  // ============================================
  createOrUpdateUserProfile: async (profileData: UserProfileData): Promise<AuthResult> => {
    try {
      const token = get().token;
      if (!token) {
        throw new Error("No authentication token");
      }

      console.log("📝 Updating user profile...");

      const response: AxiosResponse<UserResponse> = await api.post(
        "/user",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.data;

      // Update state
      set({ user: updatedUser });

      // Update AsyncStorage
      const authData: StoredAuthData = {
        user: updatedUser,
        token,
        isLoggedIn: true,
      };
      await AsyncStorage.setItem("authData", JSON.stringify(authData));

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been saved! ✨",
        position: "top",
        visibilityTime: 2000,
      });

      console.log("✅ User profile updated");
      return { success: true, data: updatedUser };

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 
        "Failed to update profile";

      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: errorMessage,
        position: "top",
        visibilityTime: 3000,
      });

      console.error("❌ Profile update error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // ============================================
  // Get User Profile - GET /user
  // ============================================
  getUserProfile: async (): Promise<AuthResult> => {
    try {
      const token = get().token;
      if (!token) {
        throw new Error("No authentication token");
      }

      const response: AxiosResponse<UserResponse> = await api.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.data;
      set({ user });

      // Update AsyncStorage
      const authData: StoredAuthData = {
        user,
        token,
        isLoggedIn: true,
      };
      await AsyncStorage.setItem("authData", JSON.stringify(authData));

      console.log("✅ User profile fetched");
      return { success: true, data: user };

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Don't show error toast for 404 (user hasn't created profile yet)
      if (axiosError.response?.status !== 404) {
        console.error("❌ Get user profile error:", axiosError.response?.data?.message);
      }
      
      return { 
        success: false, 
        error: axiosError.response?.data?.message || "Failed to fetch profile" 
      };
    }
  },

  // ============================================
  // Create Pet Profile - POST /pet
  // ============================================
  createPetProfile: async (petData: PetProfileData): Promise<AuthResult> => {
    try {
      const token = get().token;
      if (!token) {
        throw new Error("No authentication token");
      }

      console.log("🐾 Creating pet profile...");
      console.log("Pet Data:", petData);

      const response: AxiosResponse<PetResponse> = await api.post(
        "/pet",
        petData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const pet = response.data.data;
      set({ pet });

      // Toast.show({
      //   type: "success",
      //   text1: "Pet Profile Created",
      //   text2: `${pet.petName}'s profile is ready! 🐾`,
      //   position: "top",
      //   visibilityTime: 2000,
      // });

      console.log("✅ Pet profile created");
      return { success: true, data: pet };

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || 
        "Failed to create pet profile";

      Toast.show({
        type: "error",
        text1: "Failed to Create Pet Profile",
        text2: errorMessage,
        position: "top",
        visibilityTime: 3000,
      });

      console.error("❌ Pet profile creation error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // ============================================
  // Get Pet Profile - GET /pet/single
  // ============================================
  getPetProfile: async (): Promise<AuthResult> => {
    try {
      const token = get().token;
      if (!token) {
        throw new Error("No authentication token");
      }

      const response: AxiosResponse<PetResponse> = await api.get("/pet/single", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pet = response.data.data;
      set({ pet });

      console.log("✅ Pet profile fetched");
      return { success: true, data: pet };

    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Don't show error toast for 404 (user hasn't created pet profile yet)
      if (axiosError.response?.status !== 404) {
        console.error("❌ Get pet profile error:", axiosError.response?.data?.message);
      }
      
      return { 
        success: false, 
        error: axiosError.response?.data?.message || "Failed to fetch pet profile" 
      };
    }
  },

  // ============================================
  // Check Token Expiry
  // ============================================
  checkTokenExpiry: (token: string): boolean => {
    try {
      // For JWT tokens with expiry, implement proper validation
      // For now, return true (always valid)
      
      // To implement JWT expiry check:
      // import jwtDecode from 'jwt-decode';
      // interface JWTPayload { exp: number; userId: string; }
      // const decoded = jwtDecode<JWTPayload>(token);
      // const currentTime = Date.now() / 1000;
      // return decoded.exp > currentTime;

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  // ============================================
  // Get Auth State
  // ============================================
  getAuthState: (): AuthState => {
    const state = get();
    return {
      isLoggedIn: state.isLoggedIn,
      user: state.user,
      pet: state.pet,
      isLoading: state.isLoading,
      token: state.token,
    };
  },
}));

export default useAuthStore;