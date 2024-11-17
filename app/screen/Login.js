import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";

import AuthContext from "../contexts/auth";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`;



export default function LoginScreen() {
  const navigation = useNavigation();

  const [loginUser, { loading }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      
      if (!username.trim() || !password.trim()) {
        return Alert.alert("Input Error", "Username dan password tidak boleh kosong.");
      }

      const response = await loginUser({
        variables: { username, password },
      });

      const token = response.data.login.accessToken;
      if (!token) throw new Error("Failed to retrieve access token");

      console.log(response, "ini response");
      
      await SecureStore.setItemAsync("accessToken", token);
      
      if (token) {
        authContext.setIsSignedIn(true);
      }
    
      Alert.alert("Login success", "You have successfully logged in.");
      console.log(authContext.isSignedIn, "ini authcontext");
      // navigation.replace("Home");
    } catch (err) {
      Alert.alert("Login failed", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.signUpButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.SignUpContainer}>
        <Text style={styles.SignUpText}>You don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace("Register")}>
          <Text style={styles.SignUp}> Sign up. </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      padding: 20,
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginBottom: 20,
    },
    input: {
      height: 40,
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 8,
    },
    signUpButton: {
      backgroundColor: "#0095f6",
      borderRadius: 5,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    signUpButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    SignUpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
      marginHorizontal: 10,
    },
    SignUpText: {
      color: "#888",
    },
    SignUp: {
      color: "#0095f6",
      fontWeight: "bold",
    },
  })
  




