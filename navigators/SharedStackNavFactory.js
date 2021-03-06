import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Photo from "../screens/PhotoScreen";
import Profile from "../screens/Profile";
import Feed from "../screens/Feed";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Me from "../screens/Me";
import { Image } from "react-native";
import Likes from "../screens/Likes";

import PlantScreen from "../screens/PlantScreen";
import WholePlantsFeed from "../screens/WholePlantsFeed";
import CommentScreen from "../screens/CommentScreen";

const Stack = createStackNavigator();

export default function SharedStackNav({ screenName }) {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "#333",
        headerStyle: {
          backgroundColor: "#fffef2",
          shadowColor: "#333",
        },
      }}
    >
      {screenName === "Feed" ? (
        <Stack.Screen
          name={"Feed"}
          component={Feed}
          options={{
            headerTitle: () => (
              <Image
                style={{ maxHeight: 40 }}
                resizeMode="contain"
                source={require("../assets/logo.png")}
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name={"Search"} component={Search} />
      ) : null}
      {/* {screenName === "Notifications" ? (
        <Stack.Screen name={"Notifications"} component={Notifications} />
      ) : null} */}
      {screenName === "Me" ? <Stack.Screen name={"Me"} component={Me} /> : null}
      <Stack.Screen
        name="WholePlantsFeed"
        component={WholePlantsFeed}
        options={{
          headerTitle: () => (
            <Image
              style={{ maxHeight: 40 }}
              resizeMode="contain"
              source={require("../assets/logo.png")}
            />
          ),
        }}
      />
      <Stack.Screen
        name={"Notifications"}
        component={Notifications}
        options={{
          headerTitle: () => (
            <Image
              style={{ maxHeight: 40 }}
              resizeMode="contain"
              source={require("../assets/logo.png")}
            />
          ),
        }}
      />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen name="PlantScreen" component={PlantScreen} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="CommentScreen" component={CommentScreen} />
    </Stack.Navigator>
  );
}
