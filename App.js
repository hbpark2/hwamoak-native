import AppLoading from "expo-app-loading";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { NavigationContainer } from "@react-navigation/native";
import { AppearanceProvider } from "react-native-appearance";
import { Appearance, SafeAreaView, StatusBar, Text } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme, Styles } from "./Styles";
import { useEffect } from "react";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { isLoggedInVar, tokenVar, cache } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";
import { CachePersistor } from "apollo3-cache-persist";

export default function App() {
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const preloadAssets = () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
    const imagesToLoad = [require("./assets/instagram_logo.png")];
    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all([...fontPromises, ...imagePromises]);
  };

  const persistor = new CachePersistor({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
  });

  //FIXME: 16.1 (LIKE PART 2) persistCache에서 serialize:false 대신 persist.perge 추가함
  const preload = async () => {
    const token = await AsyncStorage.getItem("token");
    // console.log("PRELOAD token : " + token);

    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    await persistor.purge();
    await persistCache({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });

    return preloadAssets();
  };

  if (loading) {
    return (
      <AppLoading
        startAsync={preload}
        onError={console.warn}
        onFinish={onFinish}
      />
    );
  }
  // console.log(mode);
  // console.log(`isLoggedIn : ${isLoggedIn}`);
  return (
    <ApolloProvider client={client}>
      <AppearanceProvider>
        <SafeAreaView style={{ backgroundColor: "#fffef2" }}>
          <StatusBar animated={true} barStyle={"dark-content"} />
        </SafeAreaView>
        <ThemeProvider theme={lightTheme}>
          <NavigationContainer>
            {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
          </NavigationContainer>
        </ThemeProvider>
      </AppearanceProvider>
    </ApolloProvider>
  );
}
