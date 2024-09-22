import React, { useCallback } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import { useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native"; 
import { GET_POST } from "../queries"; 

const HomePage = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_POST); 

  useFocusEffect(
    useCallback(() => {
      refetch(); 
    }, [refetch])
  );

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  const posts = data?.posts?.data || [];

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.postFeed}>
          {posts.length > 0 ? (
             posts.map((post) => (
              <Pressable
                key={post._id}
                style={styles.post}
                onPress={() => navigation.navigate('PostDetail', { postId: post._id })} 
              >
                <Text style={styles.authorText}>Posted by: @{post.User.username}</Text>
                <Text style={styles.postText}>{post.content}</Text>
                {post.imgUrl && (
                  <Image
                    style={styles.postImage}
                    source={{ uri: post.imgUrl }}
                  />
                )}
                <View style={styles.interactionBar}>
                  <Text style={styles.interactionText}>
                    {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                  </Text>
                  <Text style={styles.interactionText}>
                    {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
                  </Text>
                </View>
              </Pressable>
            ))
          ) : (
            <Text style={styles.noPostsText}>No posts available.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  postFeed: {
    paddingVertical: 10,
  },
  post: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  postText: {
    color: "#fff",
    marginBottom: 10,
  },
  authorText: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  postImage: {
    width: "100%",
    height: 150,
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
    fontSize: 12,
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
  noPostsText: {
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HomePage;
