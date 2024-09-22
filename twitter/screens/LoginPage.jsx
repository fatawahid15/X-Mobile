import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { GET_LOGIN } from "../queries";
import * as SecureStore from "expo-secure-store";
import { LoginContext } from "../contexts/LoginContext";

const LoginPage = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [fnDispatch, { data, loading, error }] = useMutation(GET_LOGIN, {
    onCompleted: async (res) => {
      console.log("res", res);

      const token = res?.userLogin?.token;
      const user = res?.userLogin?.user;

      if (token) {
        try {
          await SecureStore.setItemAsync("token", token);
          await SecureStore.setItemAsync("user", JSON.stringify(user));
          console.log("Token and user data saved successfully!");
        } catch (err) {
          console.log("Error saving token or user data", err);
        }
        setIsLoggedIn(true);
      } else if (res?.userLogin?.error) {
        console.log("Login failed:", res.userLogin.error);
        alert(`Login failed: ${res.userLogin.error}`);
      }
    },
    onError: (err) => {
      console.log(err);
      console.log("Error:", err.message);
    },
  });

  const onPressFunction = () => {
    fnDispatch({
      variables: {
        username,
        password,
      },
    });
  };

  const onSignUpPress = () => {
    navigation.navigate("RegisterPage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in to X</Text>

      {loading && <Text>Loading...</Text>}

      {error && <Text style={styles.errorText}>Invalid Username/Password</Text>}

      {data && <Text>{JSON.stringify(data, null, 2)}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Phone, email, or username"
        value={username}
        onChangeText={setUsername}
        autoFocus={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={onPressFunction}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable>
        <Text style={styles.signUpText} onPress={onSignUpPress}>
          Don't have an account? Sign up
        </Text>
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
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  signUpText: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
});

export default LoginPage;
