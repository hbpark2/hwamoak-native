import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

const TakePhoto = () => {
  return (
    <Container>
      <Text>TakePhoto</Text>
    </Container>
  );
};

export default TakePhoto;
