import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import debounce from "lodash.debounce";
import { useFollowUser } from "./Follow";
import { useNavigation } from "@react-navigation/native";

const SEARCH_USERS = gql`
  query Search($query: String!) {
    search(query: $query) {
      _id
      name
      username
    }
  }
`;

export default function SearchUserScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, { loading, data, error }] = useLazyQuery(SEARCH_USERS);
  const navigation = useNavigation();
  const {
    handleFollow,
    loading: followLoading,
    error: followError,
  } = useFollowUser();

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        searchUsers({ variables: { query } });
      }
    }, 500),
    [searchUsers]
  );

  const onChangeText = (text) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <TouchableOpacity style={styles.avatarPlaceholder} onPress={() =>
        navigation.navigate("UserDetail", { userId: item._id })
      }>
        <View>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.username}>{item.username}</Text>
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => handleFollow(item._id)}
        disabled={followLoading}
      >
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={onChangeText}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      {data && data.search.length === 0 && (
        <Text style={styles.noResultsText}>No users found.</Text>
      )}
      <FlatList
        data={data ? data.search : []}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  followButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  noResultsText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 10,
  },
});
