import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import Room from "../screens/Room";
import Rooms from "../screens/Rooms";

const Stack = createStackNavigator();

const MessagesNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#333",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#fffef2",
        },
      }}
    >
      <Stack.Screen
        name="Rooms"
        component={Rooms}
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons name="chevron-down" color={tintColor} size={30} />
          ),
        }}
      />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
};
export default MessagesNav;
