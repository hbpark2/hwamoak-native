import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";
import UploadForm from "../screens/UploadForm";
import { Ionicons } from "@expo/vector-icons";
import MessagesNav from "./MessagesNav";
import EditProfile from "../screens/EditProfile";
import PhotoAlbum from "../screens/PhotoAlbum";

const Stack = createStackNavigator();

const LoggedInNav = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen
        name="Tabs"
        component={TabsNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Upload"
        component={UploadNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadForm"
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          headerBackTitleVisible: false,
          title: "Upload",
          headerTintColor: "#333",
          headerStyle: {
            backgroundColor: "#fffef2",
            shadowOpacity: 1,
          },
        }}
        component={UploadForm}
      />
      <Stack.Screen
        name="EditProfile"
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          headerBackTitleVisible: false,
          title: "프로필 수정",
          headerTintColor: "#333",
          headerStyle: {
            backgroundColor: "#fffef2",
            shadowOpacity: 1,
          },
        }}
        component={EditProfile}
      />

      <Stack.Screen
        name="Messages"
        component={MessagesNav}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default LoggedInNav;
