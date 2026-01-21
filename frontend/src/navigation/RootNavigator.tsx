// src/navigation/RootNavigator.tsx
import React from "react";
import useAuthStore from "../state/authStore";
import PublicNavigator from "./PublicNavigator";
import UserNavigator from "./UserNavigator";

export default function RootNavigator(): React.JSX.Element {
  const { isLoggedIn } = useAuthStore();

  return isLoggedIn ? <UserNavigator />: <PublicNavigator />;
}