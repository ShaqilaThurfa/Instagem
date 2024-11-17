import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AuthContext from "./contexts/auth";
import RegisterScreen from "./screen/Register";
import LoginScreen from "./screen/Login";
import HomeScreen from "./screen/HomeScreen";
import CreatePostScreen from "./screen/CreatePost";
import { View } from "react-native";
import PostDetailScreen from "./screen/PostDetail";
import LogoutScreen from "./screen/LogOut";
import SearchUserScreen from "./screen/SearchUser";
import UserDetailScreen from "./screen/GetUserById";
import UserProfileScreen from "./screen/ProfileUser";
import { Ionicons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeScreen" component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }} />
      <Tab.Screen
        name="Create"
        component={CreatePostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-sharp" size={size} color={color} />
          ),
        }} 
      />
      <Tab.Screen
        name="Search"
        component={SearchUserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} /> 
          ),
        }} 
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-sharp" size={size} color={color} /> 
          ),
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isSignedIn } = useContext(AuthContext);

  console.log(isSignedIn, "ini isSignedIn");

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="UserDetail" component={UserDetailScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
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
