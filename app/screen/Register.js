import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const REGISTER_USER = gql`
  mutation Mutation(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    )
  }
`;

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerUser, { loading, error, data }] = useMutation(REGISTER_USER);
  // if (loading) return <ActivityIndicator size="large" color="#00ff00" />

  // if (error) return <Text>{error.message}</Text>

  // console.log(data)
  // console.log(email, fullName, username, password);
  // navigation.replace("Login");

  return (

    <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={ async() => {
            console.log("Button clicked");
            try {
              if (!email.trim() || !fullName.trim() || !username.trim() || !password.trim()) {
                return Alert.alert("Input Error", "All fields must be filled");
              }
              await registerUser({
                variables: {
                  name: fullName,
                  username: username,
                  email: email,
                  password: password,
                },
              });
              Alert.alert("Success", data);
            } catch (error) {
              console.log(error);
              Alert.alert("Error", error.message);
            }
          }}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.loginLink}> Log in.</Text>
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
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#888",
  },
  loginLink: {
    color: "#0095f6",
    fontWeight: "bold",
  },
});
