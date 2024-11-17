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
  Alert,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LIKE_POST } from "./HomeScreen";
import AddCommentModal from "./AddComment";

const POST_DETAIL = gql`
  query PostById($postByIdId: ID!) {
    postById(id: $postByIdId) {
      _id
      content
      imgUrl
      comments {
        content
        username
      }
      likes {
        username
      }
      authorDetails {
        name
        username
        email
      }
      tags
    }
  }
`;

export default function PostDetailScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  const { id } = route.params;

  const navigation = useNavigation();

  const { loading, error, data } = useQuery(POST_DETAIL, {
    variables: { postByIdId: id },
  });

  const [likePost] = useMutation(LIKE_POST);

  const handleOnLike = async (postId) => {
    try {
      await likePost({ variables: { postId } });
      Alert.alert("Success", "Post liked successfully!");
    } catch (error) {
      console.error("Failed to like post:", error.message);
      Alert.alert("Failed to like post:", error.message);
    }
  };

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

  const post = data.postById;

  return (
    <ScrollView style={styles.container}>
      {/* Header Author */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/40" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>
          {post.authorDetails?.username || "Unknown"}
        </Text>
      </View>

      {/* Gambar Post */}
      {post.imgUrl ? (
        <Image source={{ uri: post.imgUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Image Available</Text>
        </View>
      )}

      {/* Footer Aksi */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => handleOnLike(post._id)}>
          <Text style={styles.icon}>
            ❤️ {post.likes.length > 0 && post.likes.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.icon}>💬</Text>
          <AddCommentModal
            postId={post._id}
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.icon}>↗️</Text>
        </TouchableOpacity>
      </View>

      {/* Konten Post */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Content:</Text>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      {/* Daftar Like */}
      <View style={styles.likesContainer}>
        <Text style={styles.title}>Likes by:</Text>
        {post.likes.length > 0 ? (
          <FlatList
            data={post.likes}
            keyExtractor={(item, index) => `${item.username}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.like}>
                <Text style={styles.likeText}>{item.username}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noLikes}>No likes yet</Text>
        )}
      </View>

      {/* Daftar Tag */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={styles.title}>Tags:</Text>
          <FlatList
            data={post.tags}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.tag}>
                <Text style={styles.tagText}>#{item}</Text>
              </View>
            )}
            horizontal
          />
        </View>
      )}

      {/* Komentar */}
      <View style={styles.commentsContainer}>
        <Text style={styles.title}>Comments:</Text>
        {post.comments.length > 0 ? (
          <FlatList
            data={post.comments}
            keyExtractor={(item, index) =>
              `${item.content}-${item.username}-${index}`
            }
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentText}>
                  <Text style={{ fontWeight: "bold" }}>{item.username}: </Text>
                  {item.content}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noComments}>No comments available</Text>
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
    height: 200,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  placeholderText: {
    color: "#999",
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  tagsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  commentsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tag: {
    backgroundColor: "#e0f7fa",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  tagText: {
    fontSize: 14,
    color: "#00796b",
  },
  comment: {
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  noComments: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
  },
  likesContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  like: {
    paddingVertical: 5,
  },
  likeText: {
    fontSize: 16,
    color: "#00796b",
  },
  noLikes: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
  },
});
