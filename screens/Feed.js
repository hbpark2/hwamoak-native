import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, FlatList } from "react-native";
import Photo from "../components/Photo";
import PlantFeed from "./PlantFeed";
import styled from "styled-components/native";
import useMe from "../hook/useMe";

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 5px;
`;
const HeaderRightBtn = styled.TouchableOpacity`
  margin-right: 15px;
`;
const NotificationBtn = styled.TouchableOpacity`
  margin-right: 15px;
`;

const Circle = styled.View`
  position: absolute;
  right: 0;
  width: 6px;
  height: 6px;
  background-color: tomato;
  border-radius: 5px;
`;

const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
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
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const { data: userData } = useMe();

  const notificationExist = userData?.me?.NotificationsReceived?.some(
    (item) => !item.read
  );

  const renderPhoto = ({ item: photo }) => {
    return <Photo {...photo} />;
  };

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [refreshing, setRefreshing] = useState(false);

  const MessageButton = () => (
    <HeaderRight>
      <NotificationBtn
        onPress={() =>
          navigation.navigate("Notifications", {
            userId: userData?.me?.id,
          })
        }
      >
        {notificationExist !== undefined && notificationExist && <Circle />}
        <Ionicons name="heart-circle" color="#333" size={28} />
      </NotificationBtn>
      <HeaderRightBtn onPress={() => navigation.navigate("Messages")}>
        <Ionicons name="paper-plane" color="#333" size={24} />
      </HeaderRightBtn>
    </HeaderRight>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: MessageButton,
    });

    return () =>
      navigation.setOptions({
        headerRight: MessageButton,
      });
  }, [userData]);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ListHeaderComponent={() => <PlantFeed navigation={navigation} />}
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
};
