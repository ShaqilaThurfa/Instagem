import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import AuthContext from "./contexts/auth";
import RegisterScreen from "./screen/Register";
import LoginScreen from "./screen/Login";
import HomeScreen from "./screen/HomeScreen";
import CreatePostScreen from "./screen/CreatePost";
import PostDetailScreen from "./screen/PostDetail";
import UserDetailScreen from "./screen/GetUserById";


import SearchUserScreen from "./screen/SearchUser";
import UserProfileScreen from "./screen/ProfileUser";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreatePostScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchUserScreen}
        options={{
          headerShown: true,
          title: "Find User",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Profile"
        component={UserProfileScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isSignedIn, logout } = useContext(AuthContext); 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
           
            <Stack.Screen
              name="Home"
              component={HomeTabs}
              options={{
                headerShown: true ,
                headerTitle: "Instagem", 
                headerRight: () => (
                  <TouchableOpacity onPress={logout}>
                  <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
                    Log Out
                  </Text>
                </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} 
            options={{ headerShown: true }}/>
            <Stack.Screen name="UserDetail" component={UserDetailScreen} 
            options={{ headerShown: true }}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", 
  },
  instagramText: {
    fontSize: 40, 
    fontWeight: "bold", 
    fontFamily: "Helvetica", 
    color: "#000", 
    letterSpacing: 1.5, 
  },
});
