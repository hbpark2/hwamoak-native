import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { Styles } from "../Styles";
import { FEED_PHOTO } from "../fragments";
import Swiper from "react-native-swiper";
import { of } from "zen-observable";
import AuthLayout from "../components/auth/AuthLayout";
import PhotoAlbum from "./PhotoAlbum";

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

const EditAvatarBtn = styled.TouchableOpacity`
  width: 150px;
  padding: 5px 10px;
  margin: 20px auto 0;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: rgb(246, 245, 232);
  border: 1px solid rgb(219, 219, 219);
`;
const EditAvatarBtnText = styled.Text`
  color: #333;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.6px;
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
      bio: $bio
      avatar: $avatar
    ) {
      ok
      id
      error
    }
  }
`;

const EditProfile = ({ route, navigation }) => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const updateEditProfile = (cache, result) => {
    const {
      data: { editProfile },
    } = result;

    if (editProfile.ok) {
      cache.modify({
        id: `User:${route?.params?.id}`,
        fields: {
          avatar(prev) {
            console.log(prev);
          },
          username(prev) {
            console.log(prev);
          },
        },
      });
      navigation.navigate("Tabs");
    }
  };

  const [editProfileMutation, { loading }] = useMutation(
    EDIT_PROFILE_MUTATION,
    {
      update: updateEditProfile,
    }
  );

  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit(onValid)}>
      <HeaderRightText>변경</HeaderRightText>
    </TouchableOpacity>
  );

  const HeaderRightLoading = () => (
    <ActivityIndicator size="small" color="#333" style={{ marginRight: 10 }} />
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  const onValid = async ({ username, avatar }) => {
    // console.log("####여기#####");
    // console.log(getValues("avatar"));
    // console.log("####여기#####");

    const convertedFile = new ReactNativeFile({
      uri: getValues("avatar") ? getValues("avatar") : route?.params?.avatar,
      name: `${getValues("avatar") ? "new" : "origin"}avatar.jpg`,
      type: "image/jpeg",
    });

    await editProfileMutation({
      variables: {
        username: username ? username : route?.params?.username,
        avatar: convertedFile,
      },
    });
  };

  const goToAlbum = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    register("username");
    register("avatar");
  }, [register]);
  return (
    <>
      <DismissKeyboard>
        <Container>
          <Photo
            source={{
              uri:
                (getValues("avatar") && getValues("avatar")) ||
                route?.params?.avatar,
            }}
            resizeMode="contain"
          />
          <EditAvatarBtn onPress={goToAlbum}>
            <EditAvatarBtnText>프로필 사진 변경</EditAvatarBtnText>
          </EditAvatarBtn>
          <CaptionContainer>
            <Caption
              placeholder="닉네임"
              placeholderTextColor="#333"
              onSubmitEditing={handleSubmit(onValid)}
              returnKeyType="done"
              onChangeText={(text) => setValue("username", text)}
              defaultValue={route?.params?.username}
            />
          </CaptionContainer>
        </Container>
      </DismissKeyboard>
      <Modal
        animationType="slide"
        visible={modalVisible}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <PhotoAlbum setModalVisible={setModalVisible} setValue={setValue} />
      </Modal>
    </>
  );
};

export default EditProfile;
