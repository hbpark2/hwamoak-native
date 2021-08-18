import React from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
`;

const Column = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin-right: 10px;
`;

const Username = styled.Text`
  font-weight: 600;
  color: #333;
`;

const FollowBtn = styled.TouchableOpacity`
  padding: 5px 10px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.blue};
`;
const FollowBtnText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

export default UserRow = ({ id, avatar, username, isFollowing, isMe }) => {
  const navigation = useNavigation();
  return (
    <Wrapper>
      <Column
        onPress={() =>
          navigation.navigate("Profile", {
            id,
            username,
          })
        }
      >
        <Avatar source={{ uri: avatar }} />
        <Username>{username}</Username>
      </Column>
      {!isMe ? (
        <FollowBtn>
          <FollowBtnText>{isFollowing ? "Unfallow" : "Fallow"}</FollowBtnText>
        </FollowBtn>
      ) : null}
    </Wrapper>
  );
};
