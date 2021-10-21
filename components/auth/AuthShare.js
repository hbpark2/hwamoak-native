import styled from "styled-components/native";

export const TextInput = styled.TextInput`
  display: ${(props) => (props.disable ? "none" : "flex")};
  background-color: #f6f5e8;
  padding: 15px 7px;
  border-radius: 4px;
  margin-bottom: 8px;
  margin-bottom: ${(props) => (props.lastOne ? "15px" : "8px")};
`;
