import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApolloProvider } from "@apollo/client";

import { AuthProvider } from "./contexts/auth";
import AppNavigator from "./AppNavigator";
import client from "./config/apollo";
// import * as SecureStore from "expo-secure-store";

export default function App() {
  // SecureStore.deleteItemAsync("accessToken").then(() => {
  //   console.log("Access Token cleared!");
  // });
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ApolloProvider client={client}>
          <AppNavigator />
        </ApolloProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}