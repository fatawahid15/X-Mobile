import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import LoginPage from "../screens/LoginPage";
import { LoginContext } from "../contexts/LoginContext";
import TabNavigator from "../screens/TabNavigator"; 
import ProfilePage from "../screens/ProfilePage"; 
import FollowList from '../screens/FollowList'
import RegisterPage from "../screens/RegisterPage";
import PostDetail from "../screens/PostDetail";

const Stack = createNativeStackNavigator();

const StackHolder = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="HomeTabs"
              component={TabNavigator}
              options={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#000000',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                title: "Home",
              }}
            />
            <Stack.Screen 
              name="ProfilePage" 
              component={ProfilePage}
              options={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#000',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                title: "Profile",
              }}
            />
            <Stack.Screen 
              name="FollowList" 
              component={FollowList}
              options={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#000',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                title: "Follows",
              }}
            />
             <Stack.Screen 
              name="PostDetail" 
              component={PostDetail}
              options={{
                headerTitleAlign: 'center',
                headerStyle: {
                  backgroundColor: '#000',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                  fontSize: 18,
                },
                title: "Follows",
              }}
            />
          </>
        ) : (
          <>
          <Stack.Screen 
            name="Login" 
            component={LoginPage} 
            options={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
              title: "Login",
            }}
          />
          <Stack.Screen 
            name="RegisterPage" 
            component={RegisterPage}
            options={{
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#000',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
              title: "Register",
            }}
          />
        </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackHolder;
