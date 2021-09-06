import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, logUserOut, tokenVar } from "../apollo";
import styled from "styled-components/native";
import useMe from "../hook/useMe";
import ProfileHeader from "../components/ProfileHeader";
import { gql, useQuery } from "@apollo/client";
import { PHOTO_FRAGMENT } from "../fragments";
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

export default ({ navigation }) => {
  const { data: userData } = useMe();
  const { data, loading, refetch } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: userData?.me?.username,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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

  useEffect(() => {
    navigation.setOptions({
      title: userData?.me?.username,
    });
  }, [userData]);

  return (
    <Container>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={() => <ProfileHeader {...data?.seeProfile} />}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={data?.seeProfile?.photos}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
      <TouchableOpacity onPress={() => logUserOut()}>
        <Text>logout</Text>
      </TouchableOpacity>
    </Container>
  );
};
