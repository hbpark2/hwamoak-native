import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { Styles } from "../Styles";
import { FEED_PHOTO } from "../fragments";
import Swiper from "react-native-swiper";

const Container = styled.ScrollView`
  flex: 1;
  padding: 10px 30px 0;
  background-color: ${(props) => props.theme.background};
`;

const Photo = styled.Image`
  flex: 1;
  height: 300px;
  justify-content: center;
  align-items: center;
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

const SwiperWrap = styled.View`
  flex: 1;
`;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($images: [Upload]!, $caption: String) {
    uploadPhoto(images: $images, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const UploadForm = ({ route, navigation }) => {
  const { register, handleSubmit, setValue } = useForm();

  const updateUploadPhoto = (cache, result) => {
    const {
      data: { uploadPhoto },
    } = result;

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

  const onValid = async ({ caption }) => {
    // Caption null Check
    // if (!caption) {
    //   alert("Caption can't have null");
    //   return;
    // }
    let fileList = [];
    await route.params.file.map((item, index) => {
      const file = new ReactNativeFile({
        uri: item,
        name: `photo${index}.jpg`,
        type: "image/jpeg",
      });

      return fileList.push(file);
    });

    uploadPhotoMutation({
      variables: {
        caption: caption ? caption : "",
        images: fileList,
      },
    });
  };

  return (
    <DismissKeyboard>
      <Container>
        {!loading ? (
          <>
            {route.params.file.length > 1 ? (
              <SwiperWrap>
                <Swiper
                  style={{ height: 150 }}
                  showsButtons={false}
                  dotColor="rgba(255,255,255,0.5)"
                  activeDotColor="rgba(255,255,255,1)"
                >
                  {route.params.file?.map((item, index) => (
                    <Photo
                      key={index}
                      source={{ uri: item }}
                      resizeMode="contain"
                    />
                  ))}
                </Swiper>
              </SwiperWrap>
            ) : (
              <Photo
                source={{ uri: route.params.file[0] }}
                resizeMode="contain"
              />
            )}

            <CaptionContainer>
              <Caption
                placeholder="Write a caption..."
                placeholderTextColor="#333"
                onSubmitEditing={handleSubmit(onValid)}
                returnKeyType="done"
                onChangeText={(text) => setValue("caption", text)}
              />
            </CaptionContainer>
          </>
        ) : null}
      </Container>
    </DismissKeyboard>
  );
};

export default UploadForm;
