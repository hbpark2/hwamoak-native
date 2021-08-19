import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, tokenVar } from "../apollo";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from "@apollo/client";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

const Input = styled.TextInput``;

const SEARCH_PHOTOS = gql`
  query searchPhotos($keyword: String!) {
    searchPhotos(keyword: $keyword) {
      id
      file
    }
  }
`;

export default ({ navigation }) => {
  const { setValue, register, watch } = useForm();
  const [startQueryFn, { loading, data }] = useLazyQuery(SEARCH_PHOTOS);

  const SearchBox = () => (
    <TextInput
      placeholderTextColor="#333"
      placeholder="Search photos"
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
    register("keyword");
  }, []);

  // console.log(watch());

  return (
    <DismissKeyboard>
      <Container>
        <Text>Photo</Text>
      </Container>
    </DismissKeyboard>
  );
};
