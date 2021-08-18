import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  padding: 20px 10px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const UserAvatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 10px;
`;

const Username = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const Bio = styled.Text`
  margin-top: 5px;
`;

const FollowBtn = styled.TouchableOpacity`
  width: 100px;
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.isFollowing ? "transparent" : props.theme.blue};
`;

const FollowBtnText = styled.Text`
  color: #fff;
  font-weight: 600;
  text-align: center;
`;

const SettingBtn = styled.TouchableOpacity`
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #333;
`;

const SettingBtnText = styled.Text`
  color: #333;
  font-weight: 600;
  text-align: center;
`;

export default ProfileHeader = ({
  username,
  avatar,
  bio,
  isMe,
  isFollowing,
}) => {
  return (
    <Container>
      <Header>
        <UserAvatar resizeMode="cover" source={{ uri: avatar }} />
      </Header>
      <Username>{username}</Username>
      {bio && <Bio>{bio}</Bio>}
      {!isMe ? (
        <FollowBtn isMe={isMe}>
          <FollowBtnText isFollowing={isFollowing}>
            {isFollowing ? "Unfallow" : "Fallow"}
          </FollowBtnText>
        </FollowBtn>
      ) : (
        <SettingBtn>
          <SettingBtnText>프로필 수정</SettingBtnText>
        </SettingBtn>
      )}
    </Container>
  );
};
