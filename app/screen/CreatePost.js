import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";

const CREATE_POST = gql`
  mutation CreatePost($content: String!, $imgUrl: String, $tags: [String]) {
    createPost(content: $content, imgUrl: $imgUrl, tags: $tags)
  }
`;

export default function CreatePostScreen() {
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [imgUrl, setImgUrl] = useState("");

  const navigation = useNavigation();

  const [createPost, { loading, error, data }] = useMutation(CREATE_POST, {
    refetchQueries: ["Posts"],
  });

  const handlePostCreation = async () => {
    try {
      if (!content.trim()) {
        Alert.alert("Error", "Content cannot be empty.");
        return;
      }

      await createPost({
        variables: {
          content: content,
          tags,
          imgUrl: imgUrl,
        },
      });

      setContent("");
      setTags([]);
      setImgUrl("");
      setTagInput("");

      Alert.alert("Success", "Post created successfully!");
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "An error occurred while creating the post.");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter post content"
              value={content}
              onChangeText={(text) => setContent(text)}
              multiline
            />

            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter tag"
                value={tagInput}
                onChangeText={(text) => setTagInput(text)}
                onSubmitEditing={addTag}
              />
              <Button title="Add Tag" onPress={addTag} />
            </View>

            <Text style={styles.label}>Image</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Image URL"
              value={imgUrl}
              onChangeText={(text) => setImgUrl(text)}
            />

            <FlatList
              data={tags}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeTag(item)}>
                    <Text style={styles.removeTag}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              horizontal
            />

            <Button
              title={loading ? "Creating Post..." : "Create Post"}
              onPress={handlePostCreation}
              disabled={loading}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  tagText: {
    marginRight: 5,
  },
  removeTag: {
    color: "red",
    fontWeight: "bold",
  },
});
