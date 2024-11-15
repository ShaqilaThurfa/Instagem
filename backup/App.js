import { client } from "./config/appolo";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./screen/Register";
import LoginScreen from "./screen/Login";
import { ApolloProvider } from "@apollo/client";
import HomeScreen from "./screen/HomeScreen";
import AuthContext from "./contexts/auth";
import { useState } from "react";


const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ 
        isSignedIn,
        setIsSignedIn }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isSignedIn ? "Home" : "Login" || "Register"}>

          {
            isSignedIn ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
      
              </>
            ) : (
              <>
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              </>
            ) 
          }

        </Stack.Navigator>
      </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
