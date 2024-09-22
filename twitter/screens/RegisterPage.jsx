import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useMutation } from "@apollo/client";
import { GET_REGISTER } from "../queries";

const RegisterPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [registerUser, { loading, error, data }] = useMutation(GET_REGISTER, {
    onCompleted: (res) => {
      console.log("Registration successful:", res);
      alert("Registration successful! Redirecting to login...");
      navigation.navigate("Login"); // Navigate to the login page on success
    },
    onError: (err) => {
      console.log("Error during registration:", err);
      alert(`Registration failed: ${err.message}`); // Show the error message as an alert
    },
  });

  const onRegisterPress = () => {
    if (username && email && password && name) {
      registerUser({
        variables: {
          username,
          email,
          password,
          name,
        },
      });
    } else {
      alert("All fields are required"); // Handle form validation
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>

      {loading && <Text>Registering...</Text>}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
      {data && <Text>{JSON.stringify(data, null, 2)}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <Pressable style={styles.button} onPress={onRegisterPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    marginBottom: 40,
  },
  input: {
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    fontSize: 18,
    borderRadius: 5,
    borderColor: "#333",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1D9BF0",
    padding: 12,
    width: "80%",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
  },
});

export default RegisterPage;
