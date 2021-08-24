import React from "react";
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { gql, useQuery } from "@apollo/client";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";
import { ScrollView } from "react-native-gesture-handler";
import Photo from "../components/Photo";
import ScreenLayout from "../components/ScreenLayout";
import { useState } from "react";
import PlantDetail from "../components/PlantDetail";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

const SEE_PLANT_QUERY = gql`
  query seePlant($id: Int!) {
    seePlant(id: $id) {
      id
      title
      caption
      water
      sunlight
      temperatureMin
      temperatureMax
      plantDivision
      plantClass
      plantOrder
      plantFamily
      plantGenus
      plantSpecies
      plantHome
      plantHabitat
      plantLikes
      isLiked
      user {
        username
        avatar
      }
      images {
        file
      }
    }
  }
`;
const PlantScreen = ({ route }) => {
  const { data, loading, refetch } = useQuery(SEE_PLANT_QUERY, {
    variables: {
      id: route?.params?.plantId,
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
        <PlantDetail {...data?.seePlant} fullView />
      </ScrollView>
    </ScreenLayout>
  );
};

export default PlantScreen;
