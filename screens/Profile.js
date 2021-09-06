import React, { useEffect } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import ProfileHeader from "../components/ProfileHeader";
import Photo from "../components/Photo";

const Container = styled.View`
  flex: 1;
  /* align-items: center;
  justify-content: center; */
  background-color: ${(props) => props.theme.background};
`;

const FIND_ROOM_QUERY = gql`
  query findRoom($talkingToId: Int) {
    findRoom(talkingToId: $talkingToId) {
      ok
      id
    }
  }
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
        comments {
          ...CommentFragment
        }
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default ({ navigation, route }) => {
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: route?.params?.username,
    },
  });

  const { data: roomData, loading: roomLoading } = useQuery(FIND_ROOM_QUERY, {
    variables: {
      talkingToId: route?.params?.id,
    },
  });

  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route?.params?.username,
      });
    }
  }, []);

  const renderPhoto = ({ item: photo }) => {
    return (
      <Photo
        id={photo.id}
        user={{
          username: data?.seeProfile?.username,
          avatar: data?.seeProfile?.avatar,
        }}
        caption={photo.caption}
        file={photo.file}
        isLiked={photo.isLiked}
        likes={photo.likes}
        comments={photo.comments}
        commentNumber={photo.commentNumber}
      />
    );
  };

  return (
    <Container>
      <FlatList
        ListHeaderComponent={() => (
          <ProfileHeader
            {...data?.seeProfile}
            roomId={roomData?.findRoom?.id || null}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={data?.seeProfile?.photos}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </Container>
  );
};
