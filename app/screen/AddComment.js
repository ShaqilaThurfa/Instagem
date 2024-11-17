import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation CommentPost($postId: ID!, $comment: CommentInput!) {
    commentPost(postId: $postId, comment: $comment)
  }
`;

export default function AddCommentModal({ postId, visible, onClose }) {
  const [comment, setComment] = useState("");

  const [addComment, { loading, error, data }] = useMutation(ADD_COMMENT, {
    refetchQueries: ["PostById", "Posts"],
  });

  const handleAddComment = async (postId) => {
    try {
      if (!comment.trim()) {
        Alert.alert("Error", "Comment cannot be empty.");
        return;
      }

      await addComment({
        variables: {
          postId, 
          comment: { content: comment }, 
        },
      });

      Alert.alert("Success", "Comment added successfully!");
      setComment(""); 
      onClose();
    } catch (error) {
      console.error("Failed to add comment:", error.message);
      Alert.alert("Error", error.message || "Failed to add comment.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add a Comment</Text>
          <TextInput
            style={styles.input}
            placeholder="Write your comment here..."
            value={comment}
            onChangeText={(text) => setComment(text)}
            multiline
          />
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => handleAddComment(postId)} // Bungkus dalam fungsi anonim
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#007BFF",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
