import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectPhoto from "../screens/SelectPhoto";
import TakePhoto from "../screens/TakePhoto";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const UploadNav = () => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        style: {
          backgroundColor: "#fffef2",
        },
        indicatorStyle: {
          backgroundColor: "#333",
          top: 0,
        },
      }}
    >
      <Tab.Screen name="Select">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerTintColor: "#333",
              headerTransparent: true,
              headerBackTitle: "back",
            }}
          >
            <Stack.Screen name="Select" component={SelectPhoto} />
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Take" component={TakePhoto} />
    </Tab.Navigator>
  );
};

export default UploadNav;
