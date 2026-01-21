// src/navigation/CustomDrawerContent.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import useAuthStore from "../state/authStore";

// ============================================
// Types
// ============================================

interface DrawerItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: string | number;
  badgeColor?: string;
}

interface SectionHeaderProps {
  title: string;
}

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

interface DrawerSection {
  section: string;
  items: DrawerMenuItem[];
}

interface DrawerMenuItem {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  screen?: string;
  action?: () => void;
  badge?: string | number;
  badgeColor?: string;
}

// ============================================
// Custom Drawer Content Component
// ============================================

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const { isLoggedIn, user, pet, logout } = useAuthStore();

  // ---------- Drawer Item Component ----------
  const DrawerItem: React.FC<DrawerItemProps> = ({
    iconName,
    label,
    onPress,
    badge,
    badgeColor = "bg-blue-500",
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-4 px-6 border-b border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800"
      onPress={onPress}
    >
      <Ionicons name={iconName} size={24} color="#10B981" />
      <Text className="ml-4 flex-1 text-gray-800 dark:text-gray-100 text-base font-medium">
        {label}
      </Text>
      {badge && (
        <View className={`${badgeColor} px-2 py-1 rounded-full`}>
          <Text className="text-white text-xs font-semibold">{badge}</Text>
        </View>
      )}
      <Ionicons
        name="chevron-forward"
        size={16}
        color="#9CA3AF"
        className="ml-2"
      />
    </TouchableOpacity>
  );

  // ---------- Section Header Component ----------
  const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <Text className="text-gray-500 dark:text-gray-400 text-sm font-semibold px-6 py-3 mt-4 uppercase tracking-wide">
      {title}
    </Text>
  );

  // ---------- Quick Action Component ----------
  const QuickAction: React.FC<QuickActionProps> = ({ 
    icon, 
    label, 
    onPress, 
    color = "bg-green-500" 
  }) => (
    <TouchableOpacity className="items-center flex-1" onPress={onPress}>
      <View
        className={`w-12 h-12 rounded-full ${color} items-center justify-center mb-2 shadow-lg`}
      >
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <Text className="text-xs text-gray-700 dark:text-gray-200 text-center font-medium">
        {label}
      </Text>
    </TouchableOpacity>
  );

  // ---------- Handle Logout ----------
  const handleLogout = async (): Promise<void> => {
    await logout();
    navigation.closeDrawer();
  };

  // ---------- Drawer Items for Logged-In Users ----------
  const authenticatedDrawerItems: DrawerSection[] = [
    {
      section: "MY PROFILE",
      items: [
        {
          iconName: "person-outline",
          label: "View Profile",
          screen: "MyProfileScreen",
        },
        {
          iconName: "create-outline",
          label: "User Profile Setup",
          screen: "UserProfileSetup",
        },
        {
          iconName: "paw-outline",
          label: "Pet Profile Creation",
          screen: "PetProfileCreationScreen",
        },
      ],
    },
    {
      section: "DISCOVER",
      items: [
        {
          iconName: "search-outline",
          label: "Find Matches",
          screen: "FindMatchesScreen",
        },
        {
          iconName: "heart-outline",
          label: "My Matches",
          screen: "MyMatches",
          badge: "3",
          badgeColor: "bg-pink-500",
        },
        {
          iconName: "chatbubbles-outline",
          label: "Messages",
          screen: "Messages",
          badge: "2",
          badgeColor: "bg-blue-500",
        },
      ],
    },
    {
      section: "SETTINGS",
      items: [
        {
          iconName: "notifications-outline",
          label: "Notifications",
          screen: "Notifications",
        },
        {
          iconName: "settings-outline",
          label: "Settings",
          screen: "Settings",
        },
        {
          iconName: "help-circle-outline",
          label: "Help & Support",
          screen: "HelpSupport",
        },
        {
          iconName: "log-out-outline",
          label: "Logout",
          action: handleLogout,
        },
      ],
    },
  ];

  // ---------- Public Drawer Items (Not Logged In) ----------
  const publicDrawerItems: DrawerSection[] = [
    {
      section: "GET STARTED",
      items: [
        {
          iconName: "home-outline",
          label: "Welcome",
          screen: "Welcome",
        },
        {
          iconName: "information-circle-outline",
          label: "About",
          screen: "About",
        },
        {
          iconName: "log-in-outline",
          label: "Sign In / Register",
          screen: "Auth",
        },
      ],
    },
    {
      section: "SUPPORT",
      items: [
        {
          iconName: "help-circle-outline",
          label: "Help & Support",
          screen: "HelpSupport",
        },
      ],
    },
  ];

  const sections: DrawerSection[] = isLoggedIn
    ? authenticatedDrawerItems
    : publicDrawerItems;

  // ---------- Render ----------
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="bg-gradient-to-br from-green-500 to-emerald-600 pt-12 pb-6 px-6 relative">
        <TouchableOpacity
          className="absolute top-4 right-4 z-10"
          onPress={() => navigation.closeDrawer()}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        {isLoggedIn ? (
          // Logged In Header
          <View>
            {/* User Avatar */}
            <View className="items-center mb-3">
              <View className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg">
                {pet?.imageUrl ? (
                  <Image
                    source={{ uri: pet.imageUrl }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Ionicons name="paw" size={40} color="#10B981" />
                )}
              </View>
            </View>

            <Text className="text-xl font-bold text-white text-center mb-1">
              {user?.name || "Pet Parent"}
            </Text>
            <Text className="text-white/90 text-sm text-center mb-2">
              {user?.email}
            </Text>

            {pet && (
              <View className="bg-white/20 rounded-full px-4 py-2 self-center">
                <Text className="text-white font-semibold text-xs">
                  🐾 {pet.petName} • {pet.breed || "Mixed Breed"}
                </Text>
              </View>
            )}

            {/* Quick Actions */}
            <View className="flex-row justify-around mt-4">
              <QuickAction
                icon="person-outline"
                label="Profile"
                onPress={() => navigation.navigate("MyProfile")}
                color="bg-white/20"
              />
              <QuickAction
                icon="heart-outline"
                label="Matches"
                onPress={() => navigation.navigate("MyMatches")}
                color="bg-white/20"
              />
              <QuickAction
                icon="chatbubbles-outline"
                label="Messages"
                onPress={() => navigation.navigate("Messages")}
                color="bg-white/20"
              />
            </View>
          </View>
        ) : (
          // Public Header
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg mb-3">
              <Ionicons name="paw" size={40} color="#10B981" />
            </View>
            <Text className="text-2xl font-bold text-white mb-1">
              Paw-fect Match
            </Text>
            <Text className="text-white/90 text-sm text-center">
              Find the perfect playmate for your pet! 🐾
            </Text>
          </View>
        )}
      </View>

      {/* Drawer Menu Items */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.section}>
            <SectionHeader title={section.section} />
            {section.items.map((item, idx) => (
              <DrawerItem
                key={idx}
                iconName={item.iconName}
                label={item.label}
                badge={item.badge}
                badgeColor={item.badgeColor}
                onPress={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.screen) {
                    navigation.navigate(item.screen);
                  }
                }}
              />
            ))}
          </View>
        ))}

        {/* Footer */}
        <View className="px-6 py-8 items-center">
          <Text className="text-gray-400 text-xs text-center mb-2">
            Paw-fect Match v1.0.0
          </Text>
          <Text className="text-gray-400 text-xs text-center">
            Made with 💚 for pet lovers
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomDrawerContent;