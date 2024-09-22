import { ApolloProvider } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LoginProvider } from './contexts/LoginContext';
import client from './config/apollo';
import StackHolder from './stacks/stackTable';


export default function App() {
  return (
   <ApolloProvider client={client}>
    <LoginProvider>
      <StackHolder/>
    </LoginProvider>
   </ApolloProvider>
  );
}


