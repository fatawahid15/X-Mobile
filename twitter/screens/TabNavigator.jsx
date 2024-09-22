import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomePage from "./HomePage";
import SearchUserPage from "./SearchUserPage";
import Profile from "./Profile";
import AddPost from "./AddPost";


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "AddPost") {
            iconName = focused ? "add-circle" : "add-circle-outline"; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1DA1F2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "transparent",
          elevation: 0,
        },
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="Search" component={SearchUserPage} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

