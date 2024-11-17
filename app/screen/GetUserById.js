import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

const USER_DETAIL = gql`
  query UserById($id: ID!) {
    userById(_id: $id) {
      _id
      name
      username
      email
      followers {
        username
        _id
      }
      followings {
        username
        _id
      }
    }
  }
`;

export default function UserDetailScreen() {
  const route = useRoute(); 
  const { userId } = route.params; 
  const { loading, error, data } = useQuery(USER_DETAIL, {
    variables: { id: userId },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  const user = data.userById;

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user.username}</Text>
      </View>

     
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Name:</Text>
        <Text style={styles.content}>{user.name}</Text>
        <Text style={styles.title}>Email:</Text>
        <Text style={styles.content}>{user.email}</Text>
      </View>

     
      <View style={styles.section}>
        <Text style={styles.title}>Followers:</Text>
        {user.followers.length > 0 ? (
          <FlatList
            data={user.followers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listText}>{item.username}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noData}>No followers</Text>
        )}
      </View>

      {/* Followings */}
      <View style={styles.section}>
        <Text style={styles.title}>Followings:</Text>
        {user.followings.length > 0 ? (
          <FlatList
            data={user.followings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listText}>{item.username}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noData}>No followings</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  listItem: {
    paddingVertical: 5,
  },
  listText: {
    fontSize: 16,
  },
  noData: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
  },
});
