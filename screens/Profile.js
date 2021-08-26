import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { isLoggedInVar, tokenVar } from "../apollo";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";
import ProfileHeader from "../components/ProfileHeader";
import Photo from "../components/Photo";

const Container = styled.View`
  flex: 1;
  /* align-items: center;
  justify-content: center; */
  background-color: ${(props) => props.theme.background};
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

export default ({ navigation, route }) => {
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: route?.params?.username,
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
        commentNumber={photo.commentNumber}
      />
    );
  };

  return (
    <Container>
      <FlatList
        ListHeaderComponent={() => <ProfileHeader {...data?.seeProfile} />}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={data?.seeProfile?.photos}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </Container>
  );
};
