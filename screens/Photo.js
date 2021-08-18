import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, tokenVar } from "../apollo";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

export default ({ navigation }) => {
  return (
    <Container>
      <Text>Photo</Text>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text>Profile</Text>
      </TouchableOpacity>
    </Container>
  );
};
