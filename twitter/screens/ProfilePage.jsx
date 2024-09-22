import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFILE, ADD_FOLLOW, REMOVE_FOLLOW } from '../queries/index';
import * as SecureStore from 'expo-secure-store';

const ProfilePage = ({ route, navigation }) => {
  const { userId } = route.params;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await SecureStore.getItemAsync('user');
      setCurrentUser(JSON.parse(user));
    };
    getUser();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_PROFILE, {
    variables: { id: userId },
    skip: !userId,
  });

  console.log(userId);
  
  const [addFollow] = useMutation(ADD_FOLLOW, {
    variables: { userId },
    onCompleted: () => {
      Alert.alert('Success', 'You are now following this user!');
      refetch(); 
    },
    onError: () => {
      Alert.alert('Error', 'Failed to follow the user. Please try again.');
    },
  });


  const [removeFollow] = useMutation(REMOVE_FOLLOW, {
    variables: { userId },
    onCompleted: () => {
      Alert.alert('Success', 'You have unfollowed this user!');
      refetch();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to unfollow the user. Please try again.');
    },
  });

  useEffect(() => {
    if (data && currentUser) {
      const isUserFollowing = data.userById.data.followers.some(
        (follower) => follower._id === currentUser._id
      );
    }
  }, [data, currentUser]);

  if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>Error fetching profile.</Text>;

  const profileData = data?.userById?.data;

  return (
    <View style={styles.container}>
      {profileData ? (
        <>
          <View style={styles.nameSection}>
            <Text style={styles.username}>{profileData.name}</Text>
          </View>
          <Text style={styles.handle}>@{profileData.username}</Text>

          <View style={styles.statsSection}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowList', { users: profileData.followers, title: 'Followers', userId })
              }
            >
              <Text style={styles.statsText}>
                <Text style={styles.boldText}>{profileData.following.length}</Text> Following
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('FollowList', { users: profileData.following, title: 'Following', userId })
              }
            >
              <Text style={styles.statsText}>
                <Text style={styles.boldText}>{profileData.followers.length}</Text> Followers
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonSection}>

              <TouchableOpacity style={styles.unfollowButton} onPress={removeFollow}>
                <Text style={styles.buttonText}>Unfollow</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.followButton} onPress={addFollow}>
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
          </View>
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
  nameSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#fff',
  },
  boldText: {
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  buttonSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#1DA1F2',
    padding: 10,
    borderRadius: 5,
  },
  unfollowButton: {
    backgroundColor: '#E0245E',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfilePage;
