import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useQuery } from '@apollo/client';
import { SEARCH_USER } from '../queries/index'; 

const SearchUserPage = ({ navigation }) => { 
  const [username, setUsername] = useState("");

  const { loading, error, data } = useQuery(SEARCH_USER, {
    variables: { username },
    skip: !username, 
  });

  const handleUserPress = (userId) => {
    navigation.navigate('ProfilePage', { userId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
          />
          <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
        </View>

        <ScrollView contentContainerStyle={styles.userFeed}>
          {loading && <Text style={styles.loadingText}>Loading...</Text>}
          {error && <Text style={styles.errorText}>Error fetching users.</Text>}
          {data && data.userSearch.data.length > 0 ? (
            data.userSearch.data.map((user) => (
              <Pressable key={user._id} onPress={() => handleUserPress(user._id)}>
                <View style={styles.userCard}>
                  <Text style={styles.userName}>{!user.name || user.name === "null" ? "No Username" : user.name }</Text>
                  <Text style={styles.userUsername}>@{user.username}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            username && !loading && <Text style={styles.noResultsText}>No users found.</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#000",
    height: "100%",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#111",
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 40,
  },
  searchIcon: {
    marginLeft: 10,
  },
  userFeed: {
    paddingVertical: 10,
  },
  userCard: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  userUsername: {
    color: "#888",
    marginBottom: 5,
  },
  userEmail: {
    color: "#888",
  },
  loadingText: {
    color: "#fff",
    textAlign: 'center',
  },
  errorText: {
    color: "red",
    textAlign: 'center',
  },
  noResultsText: {
    color: "#888",
    textAlign: "center",
  },
});

export default SearchUserPage;
