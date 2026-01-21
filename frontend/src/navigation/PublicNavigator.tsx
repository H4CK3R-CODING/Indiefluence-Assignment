// src/navigation/PublicNavigator.jsx
import React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

// Public Screens
// import LoginScreen from "../screens/Auth/LoginScreen";
import CustomDrawerContent from "./CustomDrawerContent";
import WelcomeScreen from "../screens/WelcomeScreen";
import AuthenticationScreen from "../screens/AuthenticationScreen";
import UserProfileSetupScreen from "../screens/Profile/UserProfileSetupScreen";
import PetProfileCreationScreen from "../screens/PetProfileCreationScreen";
// import RegistrationPage from "../screens/Auth/Registeration";
// import ProfileScreen from "../screens/Profile/ProfileScreen";

const Drawer = createDrawerNavigator();

export default function PublicNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 300 },
        // gestureEnabled: true,
        // gestureDirection: "horizontal",
      }}
    >
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="Auth" component={AuthenticationScreen} />
      
    </Drawer.Navigator>
  );
}
