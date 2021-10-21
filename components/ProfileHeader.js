import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import useMe from "../hook/useMe";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  padding: 20px 10px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserAvatar = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 10px;
`;

const FollowPplContainer = styled.View`
  flex-direction: row;
  padding-right: 10px;
`;
const FpView = styled.View`
  margin-left: 10px;
`;
const FpTopText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  text-align: center;
`;
const FpBottomText = styled.Text`
  text-align: center;
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
  height: 30px;
  justify-content: center;
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 4px;
  background-color: ${(props) => {
    return props.isFollowing ? "rgb(246, 245, 232)" : props.theme.blue;
  }};
  border: ${(props) =>
    props.isFollowing ? "1px solid rgb(219, 219, 219)" : "none"};
`;

const FollowBtnText = styled.Text`
  /* color: #fff; */
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  font-size: 14px;
  color: ${(props) => (props.isFollowing ? "#555" : "#fff")};
`;

const SettingBtn = styled.TouchableOpacity`
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #333;
  background-color: rgb(246, 245, 232);
  border: 1px solid rgb(219, 219, 219);
`;

const SettingBtnText = styled.Text`
  color: #333;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.6px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SendMessageBtn = styled.TouchableOpacity`
  justify-content: center;
  width: 100px;
  height: 30px;
  padding: 5px 10px;
  margin-top: 10px;
  margin-left: 10px;
  border-radius: 4px;
  background-color: rgb(246, 245, 232);
  border: 1px solid rgb(219, 219, 219);
`;

const SendMessageBtnText = styled.Text`
  color: #555;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
      error
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
      error
    }
  }
`;

export default ProfileHeader = ({
  id,
  username,
  avatar,
  bio,
  isMe,
  isFollowing,
  totalFollowing,
  totalFollowers,
  roomId,
}) => {
  const { data: meData } = useMe();
  const navigation = useNavigation();
  const talkingTo = {
    id,
    username,
    avatar,
  };

  const followUserCompleted = (cache, result) => {
    const {
      data: {
        followUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }

    cache.modify({
      id: `User:${id}`,
      fields: {
        isFollowing(prev) {
          return true;
        },
        totalFollowers(prev) {
          return prev + 1;
        },
      },
    });

    cache.modify({
      id: `User:${meData?.me?.id}`,
      fields: {
        totalFollowing(prev) {
          console.log(prev);
          return prev + 1;
        },
      },
    });
  };

  const unfollowUserUpdate = (cache, result) => {
    const {
      data: {
        unfollowUser: { ok },
      },
    } = result;
    if (!ok) {
      return;
    }
    cache.modify({
      id: `User:${id}`,
      fields: {
        isFollowing(prev) {
          return false;
        },
        totalFollowers(prev) {
          return prev - 1;
        },
      },
    });

    cache.modify({
      id: `User:${meData?.me?.id}`,
      fields: {
        totalFollowing(prev) {
          return prev - 1;
        },
      },
    });
  };

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: { username },
    update: followUserCompleted,
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: { username },
    update: unfollowUserUpdate,
  });

  const getFollowBtn = () => {
    if (isFollowing) {
      return (
        <FollowBtn isMe={isMe} onPress={unfollowUser} isFollowing={isFollowing}>
          <FollowBtnText isFollowing={true}>팔로우 취소</FollowBtnText>
        </FollowBtn>
      );
    } else {
      return (
        <FollowBtn isMe={isMe} onPress={followUser} isFollowing={isFollowing}>
          <FollowBtnText isFollowing={false}>팔로우</FollowBtnText>
        </FollowBtn>
      );
    }
  };

  const goToRoom = () => {
    navigation.navigate("Messages", {
      screen: "Room",
      params: {
        id: roomId,
        talkingTo,
      },
    });
  };

  const goToEditProfile = () => {
    navigation.navigate("EditProfile", {
      avatar,
      username,
      id: meData.me.id,
    });
  };

  return (
    <Container>
      <Header>
        <UserAvatar resizeMode="cover" source={{ uri: avatar }} />
        <FollowPplContainer>
          <FpView>
            <FpTopText>{totalFollowers}</FpTopText>
            <FpBottomText>팔로우</FpBottomText>
          </FpView>
          <FpView>
            <FpTopText>{totalFollowing}</FpTopText>
            <FpBottomText>팔로잉</FpBottomText>
          </FpView>
        </FollowPplContainer>
      </Header>
      <Username>{username}</Username>
      {bio && <Bio>{bio}</Bio>}
      {!isMe ? (
        <BtnContainer>
          {/* <FollowBtn
            isMe={isMe}
            onPress={isFollowing ? unfollowUser : followUser}
          >
            <FollowBtnText isFollowing={isFollowing}>
              {isFollowing ? "팔로우 취소" : "팔로우"}
            </FollowBtnText>
          </FollowBtn> */}
          {getFollowBtn()}
          <SendMessageBtn onPress={goToRoom}>
            <SendMessageBtnText>메시지</SendMessageBtnText>
          </SendMessageBtn>
        </BtnContainer>
      ) : (
        <SettingBtn onPress={goToEditProfile}>
          <SettingBtnText>프로필 수정</SettingBtnText>
        </SettingBtn>
      )}
    </Container>
  );
};
