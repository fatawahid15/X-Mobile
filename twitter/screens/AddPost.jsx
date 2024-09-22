import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useMutation } from '@apollo/client';
import { ADD_POST } from '../queries'; // Assuming this is the correct path to your queries

const AddPost = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const [addPost, { loading }] = useMutation(ADD_POST, {
    onCompleted: () => {
      Alert.alert('Success', 'Post added successfully!');
      navigation.navigate('Home'); // Redirect to Home after success
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleSubmit = () => {
    if (content.trim() === '') {
      Alert.alert('Error', 'Post content is required.');
      return;
    }

    // Converting tags input into an array
    const tagArray = tags.split(',').map(tag => tag.trim());

    // Call the mutation to add a post
    addPost({
      variables: {
        content,
        tags: tagArray,
        imgUrl,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="What's on your mind?"
        placeholderTextColor="#888"
        multiline
      />

      <Text style={styles.label}>Tags (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholder="e.g. coding,react-native"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={imgUrl}
        onChangeText={setImgUrl}
        placeholder="https://example.com/image.jpg"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Posting...' : 'Add Post'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPost;
