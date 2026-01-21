import React, { createContext, useState, useEffect, ReactNode } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

// Define theme type
type Theme = "light" | "dark";

// Define context value type
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => Promise<void>;
  isLoading: boolean;
}

// Define provider props type
export interface ThemeProviderProps {
  children: ReactNode;
}

// Create context with proper typing
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<Theme>("light");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load stored theme or system default
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
          setTheme(stored);
          setColorScheme(stored);
        } else {
          const system: Theme = (colorScheme as Theme) || "light";
          setTheme(system);
          setColorScheme(system);
        }
      } catch (error) {
        console.log("Error loading theme:", error);
        setTheme("light");
        setColorScheme("light");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setColorScheme, colorScheme]);

  // Toggle theme
  const toggleTheme = async (): Promise<void> => {
    try {
      const newTheme: Theme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      setColorScheme(newTheme);
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  // Context value with proper typing
  const contextValue: ThemeContextValue = {
    theme,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      {children}
    </ThemeContext.Provider>
  );
}

// Optional: Custom hook for using the theme context with type safety
export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};