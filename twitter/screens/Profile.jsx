import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useQuery } from '@apollo/client';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { GET_PROFILE } from '../queries/index'; 
import { LoginContext } from '../contexts/LoginContext';

const Profile = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { setIsLoggedIn } = useContext(LoginContext);

  const getUserId = async () => {
    try {
      const user = await SecureStore.getItemAsync("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData;
      } else {
        setErrorMessage('No user found');
        return null;
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Error fetching user');
      return null;
    }
  };

  const handleFetchProfile = async () => {
    const user = await getUserId();
    if (user) {
      setUserId(user._id);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleFetchProfile();
    }, [])
  );

  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      setIsLoggedIn(false)
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;
  if (errorMessage) return <Text style={styles.errorText}>{errorMessage}</Text>;

  const profileData = data?.userById?.data;

  return (
    <View style={styles.container}>
      {profileData ? (
        <>
          <View style={styles.nameSection}>
            <Text style={styles.username}>{profileData?.name}</Text>
          </View>
          <Text style={styles.handle}>@{profileData?.username}</Text>

          <View style={styles.statsSection}>
            <Text style={styles.statsText}>
              <Text style={styles.boldText}>{profileData?.following.length}</Text> Following
            </Text>
            <Text style={styles.statsText}>
              <Text style={styles.boldText}>{profileData?.followers.length}</Text> Followers
            </Text>
          </View>

          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text style={styles.errorText}>No profile data found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  handle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statsText: {
    color: '#fff',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default Profile;
 