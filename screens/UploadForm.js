import React, { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { Styles } from "../Styles";
import { FEED_PHOTO } from "../fragments";

const Container = styled.View`
  flex: 1;
  padding: 0 50px;
  background-color: ${(props) => props.theme.background};
`;

const Photo = styled.Image`
  height: 350px;
`;

const CaptionContainer = styled.View`
  margin-top: 30px;
`;

const Caption = styled.TextInput`
  padding: 10px 20px;
  border-radius: 7px;
  background-color: rgb(246, 245, 232);
  border: 1px solid rgb(219, 219, 219);
`;
const HeaderRightText = styled.Text`
  color: ${Styles.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const UploadForm = ({ route, navigation }) => {
  const updateUploadPhoto = (cache, result) => {
    const {
      data: { uploadPhoto },
    } = result;
    console.log(uploadPhoto);
    if (uploadPhoto.id) {
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeFeed(prev) {
            return [uploadPhoto, ...prev];
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };

  const [uploadPhotoMutation, { loading }] = useMutation(
    UPLOAD_PHOTO_MUTATION,
    {
      update: updateUploadPhoto,
    }
  );

  const { register, handleSubmit, setValue } = useForm();
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );

  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="#333" style={{ marginRight: 10 }} />
  );

  useEffect(() => {
    register("caption");
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const onValid = ({ caption }) => {
    const file = new ReactNativeFile({
      uri: route.params.file,
      name: `1.jpg`,
      type: "image/jpeg",
    });
    uploadPhotoMutation({
      variables: {
        caption,
        file,
      },
    });
  };
  return (
    <DismissKeyboard>
      <Container>
        <Photo source={{ uri: route.params.file }} resizeMode="contain" />
        <CaptionContainer>
          <Caption
            placeholder="Write a caption..."
            placeholderTextColor="#333"
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
            onChangeText={(text) => setValue("caption", text)}
          />
        </CaptionContainer>
      </Container>
    </DismissKeyboard>
  );
};

export default UploadForm;
