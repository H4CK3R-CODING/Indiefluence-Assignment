// src/navigation/UserNavigator.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";
import WelcomeScreen from "../screens/WelcomeScreen";
import UserProfileSetupScreen from "../screens/Profile/UserProfileSetupScreen";
import PetProfileCreationScreen from "../screens/PetProfileCreationScreen";
import MyProfileScreen from "../screens/MyProfileScreen";

// User Screens - Paw-fect Match
// import MyProfileScreen from "../screens/Profile/MyProfileScreen";
// import UserProfileSetupScreen from "../screens/Profile/UserProfileSetupScreen";
// import PetProfileSetupScreen from "../screens/Profile/PetProfileSetupScreen";
import FindMatchesScreen from "../screens/FindMatchesScreen";
import MessagesScreen from "../screens/MessagesScreen";
import MyMatchesScreen from "../screens/MyMatchesScreen";
// import MyMatchesScreen  from "../screens/Matches/MyMatchesScreen";
// import MessagesScreen from "../screens/Messages/MessagesScreen";
// ============================================
// Types
// ============================================

export type UserDrawerParamList = {
  MyProfile: undefined;
  UserProfileSetup: undefined;
  PetProfileCreationScreen: undefined;
  PetProfileSetup: undefined;
  MyProfileScreen: undefined;
  FindMatches: undefined;
  MyMatches: undefined;
  Messages: undefined;
  Notifications: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  FindMatchesScreen: undefined;
};

const Drawer = createDrawerNavigator<UserDrawerParamList>();

// ============================================
// User Navigator Component
// ============================================

export default function UserNavigator(): React.JSX.Element {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { 
          width: 300,
          backgroundColor: 'transparent',
        },
        // gestureEnabled: true,
        // gestureDirection: "horizontal",
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >

      <Drawer.Screen 
        name="MyProfile" 
        component={WelcomeScreen}
        options={{ 
          title: "My Profile",
          drawerLabel: "My Profile",
        }}
      />
      <Drawer.Screen
        name="UserProfileSetup"
        component={UserProfileSetupScreen}
      />
      <Drawer.Screen
        name="PetProfileCreationScreen"
        component={PetProfileCreationScreen}
      />
      <Drawer.Screen
        name="MyProfileScreen"
        component={MyProfileScreen}
      />
      <Drawer.Screen
        name="FindMatchesScreen"
        component={MyMatchesScreen}
      />
      {/* Profile Screens */}
      {/* <Drawer.Screen 
        name="MyProfile" 
        component={MyProfileScreen}
        options={{ 
          title: "My Profile",
          drawerLabel: "My Profile",
        }}
      />
      
      <Drawer.Screen 
        name="UserProfileSetup" 
        component={UserProfileSetupScreen}
        options={{ 
          title: "Edit Profile",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      
      <Drawer.Screen 
        name="PetProfileSetup" 
        component={PetProfileSetupScreen}
        options={{ 
          title: "Pet Profile Setup",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      /> */}

      {/* Matching Screens */}
      {/* <Drawer.Screen 
        name="FindMatches" 
        component={FindMatchesScreen}
        options={{ 
          title: "Find Matches",
          drawerLabel: "Find Matches",
        }}
      />
      
      <Drawer.Screen 
        name="MyMatches" 
        component={MyMatchesScreen}
        options={{ 
          title: "My Matches",
          drawerLabel: "My Matches",
        }}
      /> */}

      {/* Messages */}
      {/* <Drawer.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ 
          title: "Messages",
          drawerLabel: "Messages",
        }}
      /> */}

    </Drawer.Navigator>
  );
}