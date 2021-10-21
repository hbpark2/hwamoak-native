import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
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

export default ({ navigation, route }) => {
  const { data, loading } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username: route?.params?.username,
    },
  });
  const {
    data: feedData,
    loading: feedLoading,
    refetch: feedRetch,
    fetchMore,
  } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
      username: route?.params?.username,
    },
  });

  const { data: roomData, loading: roomLoading } = useQuery(FIND_ROOM_QUERY, {
    variables: {
      talkingToId: route?.params?.id,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderPhoto = ({ item: photo }) => {
    return <Photo {...photo} />;
  };

  useEffect(() => {
    if (route?.params?.username) {
      navigation.setOptions({
        title: route?.params?.username,
      });
    }

    return () => {
      navigation.setOptions();
    };
  }, []);

  return (
    <Container>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={() => (
          <ProfileHeader
            {...data?.seeProfile}
            roomId={roomData?.findRoom?.id || null}
          />
        )}
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: feedData?.seeFeed?.length,
            },
          })
        }
        loading={feedLoading}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={feedData?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </Container>
  );
};
