import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

const SelectPhoto = () => {
  return (
    <Container>
      <Text>SelectPhoto</Text>
    </Container>
  );
};

export default SelectPhoto;
