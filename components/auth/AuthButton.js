import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { ActivityIndicator } from "react-native";

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.blue};
  padding: 15px 10px;
  border-radius: 5px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
`;
const ButtonText = styled.Text`
  color: #fff;
  font-weight: 600;
  text-align: center;
`;

const AuthButton = ({ onPress, disabled, text, loading }) => {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ButtonText>{text}</ButtonText>
      )}
    </Button>
  );
};

AuthButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  text: PropTypes.string,
};

export default AuthButton;
