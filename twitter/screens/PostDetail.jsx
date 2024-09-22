import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SPEC_POST, ADD_LIKE, ADD_COMMENT } from "../queries"; 

const PostDetail = ({ route }) => {
  const { postId } = route.params;
  const { loading, error, data, refetch } = useQuery(GET_SPEC_POST, { variables: { id: postId } });
  const [newComment, setNewComment] = useState("");
  const [addLike] = useMutation(ADD_LIKE);
  const [addComment] = useMutation(ADD_COMMENT);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const post = data?.specPost?.data;

  const handleLike = async () => {
    await addLike({ variables: { postId } });
    refetch(); // Refetch after liking
  };

  const handleComment = async () => {
    await addComment({ variables: { content: newComment, postId } });
    setNewComment(""); 
    refetch(); 
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.mainContent}>
        <View style={styles.post}>
          {/* Author and post content */}
          <Text style={styles.authorText}>Posted by: @{post.User.username}</Text>
          <Text style={styles.postText}>{post.content}</Text>
          {post.imgUrl && (
            <Image style={styles.postImage} source={{ uri: post.imgUrl }} />
          )}

          {/* Likes and Comments Count */}
          <View style={styles.interactionBar}>
            <Pressable onPress={handleLike}>
              <Text style={styles.interactionText}>
                {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
              </Text>
            </Pressable>
            <Text style={styles.interactionText}>
              {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
            </Text>
          </View>
        </View>

        {/* Comments section */}
        <Text style={styles.sectionTitle}>Comments</Text>
        {post.comments.length > 0 ? (
          post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentAuthor}>@{comment.username}</Text>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCommentsText}>No comments yet.</Text>
        )}

        {/* Comment input */}
        <Text style={styles.sectionTitle}>Add a Comment</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          placeholderTextColor="#888"
        />
        <Pressable style={styles.postButton} onPress={handleComment}>
          <Text style={styles.postButtonText}>Post Comment</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainContent: {
    padding: 10,
  },
  post: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  authorText: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  postText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  interactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  interactionText: {
    color: "#888",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  comment: {
    paddingVertical: 5,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  commentAuthor: {
    color: "#1DA1F2",
    fontWeight: "bold",
  },
  commentText: {
    color: "#fff",
    fontSize: 14,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#1DA1F2",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  noCommentsText: {
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
});

export default PostDetail;
