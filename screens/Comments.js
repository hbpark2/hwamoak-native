import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Text, View } from "react-native";
import { isLoggedInVar, tokenVar } from "../apollo";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

export default () => {
  return (
    <Container>
      <Text>Comments</Text>
    </Container>
  );
};
