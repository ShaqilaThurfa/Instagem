import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { gql, useQuery, useMutation } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

// Query untuk mendapatkan post
const GET_POST = gql`
  query Posts {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      authorDetails {
        name
        username
        email
      }
      likes {
        username
      }
    }
  }
`;


export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      likes {
        username
        createdAt
      }
    }
  }
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { loading, error, data, refetch } = useQuery(GET_POST);
  
  const [likePost] = useMutation(LIKE_POST, {
    update(cache, { data: { likePost } }) {
      const existingPosts = cache.readQuery({ query: GET_POST });
      if (existingPosts && existingPosts.posts) {
        const updatedPosts = existingPosts.posts.map((post) => {
          if (post._id === likePost._id) {
            return { ...post, likes: likePost.likes };
          }
          return post;
        });

        cache.writeQuery({
          query: GET_POST,
          data: { posts: updatedPosts },
        });
      }
    },
  });

  useEffect(() => {
    const fetchToken = async () => {
      const token = await SecureStore.getItemAsync("accessToken");
      console.log("Access Token:", token);
    };
    fetchToken();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

   const handleOnLike = async (postId) => {
    try {
      await likePost({ variables: { postId } });
      Alert.alert("Success", "Post liked successfully!");
      
    } catch (error) {
      console.error("Failed to like post:", error.message);
      Alert.alert("Failed to like post:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data.posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
           
            <View style={styles.header}>
              <Image
                source={{ uri: "https://via.placeholder.com/40" }}
                style={styles.avatar}
              />
              <Text style={styles.username}>
                {item.authorDetails?.username || "Unknown"}
              </Text>
            </View>

            
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PostDetail", { id: item._id })
              }
            >
              {item.imgUrl ? (
                <Image source={{ uri: item.imgUrl }} style={styles.image} />
              ) : (
                <View style={styles.noImage}>
                  <Text>No Image</Text>
                </View>
              )}
              <Text style={styles.content}>{item.content}</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => handleOnLike(item._id)}>
                <Text style={styles.icon}>
                  ❤️ {item.likes.length > 0 && item.likes.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.icon}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.icon}>↗️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  noImage: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  icon: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
};
