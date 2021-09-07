import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Styles } from "../Styles";

const Container = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  background-color: ${Styles.contentBg};
  border: 1px solid ${Styles.borderColor};
`;
const UserAvatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  margin-right: 10px;
`;
const Photo = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 5px;
`;
const Username = styled.Text`
  font-weight: 600;
`;
const Caption = styled.Text``;

const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const NotificationItem = ({ id, notificationType, sendUser, photo }) => {
  const navigation = useNavigation();
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: sendUser?.username,
      id: sendUser?.id,
    });
  };

  const goToPhotoScreen = () => {
    navigation.navigate("Photo", {
      photoId: photo?.id,
    });
  };

  return (
    <Container onPress={goToPhotoScreen}>
      <Left>
        <UserItem onPress={goToProfile}>
          <UserAvatar source={{ uri: sendUser?.avatar }} />
          <Username>{sendUser?.username}</Username>
        </UserItem>
        <Caption>님이 회원님의 사진</Caption>
        <Caption>
          {notificationType === "like"
            ? "을 좋아합니다."
            : "에 댓글을 달았습니다."}
        </Caption>
      </Left>
      <Photo source={{ uri: photo?.file }} size="cover" />
    </Container>
  );
};

export default NotificationItem;
