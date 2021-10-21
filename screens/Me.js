import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, logUserOut, tokenVar } from "../apollo";
import styled from "styled-components/native";
import useMe from "../hook/useMe";
import ProfileHeader from "../components/ProfileHeader";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";

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
const FEED_QUERY = gql`
  query seeFeed($offset: Int!, $username: String!) {
    seeFeed(offset: $offset, username: $username) {
      ...PhotoFragment
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

export default ({ navigation }) => {
  const { data: userData } = useMe();
  const { data, refetch } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: userData?.me?.username,
    },
  });

  const {
    data: feedData,
    loading: feedLoading,
    refetch: feedRefetch,
    fetchMore,
  } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
      username: userData?.me?.username,
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  //로그아웃했을 때 로딩 true 만들어서 밑에 렌더포토 를 로딩false일때만만들게하기

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
        comments={photo.comments}
        images={photo.images}
        isLiked={photo.isLiked}
        likes={photo.likes}
        commentNumber={photo.commentNumber}
      />
    );
  };

  const onClickLogout = () => {
    logUserOut();
  };

  useEffect(() => {
    navigation.setOptions({
      title: userData?.me?.username,
    });
    refetch();
  }, [userData]);

  return (
    <ScreenLayout loading={feedLoading}>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={() => <ProfileHeader {...data?.seeProfile} />}
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: feedData?.seeFeed?.length,
            },
          })
        }
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={feedData?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
      <TouchableOpacity onPress={onClickLogout}>
        <Text>logout</Text>
      </TouchableOpacity>
    </ScreenLayout>
  );
};
