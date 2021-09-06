import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { logUserOut } from "../apollo";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

export default ScreenLayout = ({ loading, children }) => {
  return (
    <Container>
      {loading ? <ActivityIndicator color="#333" /> : children}
    </Container>
  );
};
