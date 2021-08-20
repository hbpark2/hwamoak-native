import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { isLoggedInVar, tokenVar } from "../apollo";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { ScrollView } from "react-native-gesture-handler";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { useState } from "react";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

const SEE_PHOTO = gql`
  query seePhoto($id: Int!) {
    seePhoto(id: $id) {
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

const PhotoScreen = ({ route }) => {
  const { data, loading, refetch } = useQuery(SEE_PHOTO, {
    variables: {
      id: route?.params?.photoId,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        style={{
          backgroundColor: "#fffef2",
        }}
        contentContainerStyle={{
          backgroundColor: "#fffef2",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Photo {...data?.seePhoto} fullView />
      </ScrollView>
    </ScreenLayout>
  );
};

export default PhotoScreen;
