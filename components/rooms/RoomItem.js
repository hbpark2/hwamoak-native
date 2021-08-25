import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";
import useMe from "../../hook/useMe";
import { Styles } from "../../Styles";
const RoomContainer = styled.TouchableOpacity`
  /* background-color: ${(props) => props.theme.background}; */
  width: 100%;
  padding: 15px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Column = styled.View`
  color: #333;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 25px;
`;

const Data = styled.View``;

const UnreadDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${Styles.blue};
  border-radius: 5px;
`;

const Username = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const UnreadText = styled.Text`
  color: #333;
  margin-top: 2px;
  font-weight: 500;
`;

const RoomItem = ({ users, unreadTotal, id }) => {
  const { data: meData } = useMe();
  const navigation = useNavigation();
  const talkingTo = users.find(
    (user) => user.username !== meData?.me?.username
  );

  const goToRoom = () =>
    navigation.navigate("Room", {
      id,
      talkingTo,
    });

  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatar source={{ uri: talkingTo.avatar }} />
        <Data>
          <Username>{talkingTo.username}</Username>
          <UnreadText>
            {unreadTotal} unread
            {unreadTotal === 1 ? "message" : "messages"}
          </UnreadText>
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 ? <UnreadDot /> : null}</Column>
    </RoomContainer>
  );
};

export default RoomItem;
