import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { gql, useQuery } from "@apollo/client";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Plant from "../components/Plant";

const Container = styled.View`
  width: ${(props) => props?.width}px;
  background-color: ${(props) => props.theme.background};
`;
const LinkBox = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  padding: 15px 15px 0;
  align-items: center;
  justify-content: flex-end;
`;
const LinkText = styled.Text`
  color: #333;
  font-weight: 600;
  margin-bottom: 2px;
  margin-left: 5px;
`;

const PLANTS_FEED_QUERY = gql`
  query seePlantsFeed {
    seePlantsFeed {
      id
      title
      caption
      water
      sunlight
      temperatureMin
      temperatureMax
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

const PlantFeed = ({ navigation, searchScreen }) => {
  const { width } = useWindowDimensions();
  const { data: plantsData, refetch } = useQuery(PLANTS_FEED_QUERY, {
    skip: 0,
  });

  const renderPhoto = ({ item: plant }) => {
    return <Plant {...plant} />;
  };

  // console.log(plantsData?.seeWholePlantsFeed);
  // console.log(navigation);

  return (
    <Container width={width} searchScreen={searchScreen}>
      {searchScreen ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: "100%" }}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
          numColumns={2}
          data={plantsData?.seePlantsFeed}
          keyExtractor={(plant) => "" + plant.id}
          renderItem={renderPhoto}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          horizontal={true}
          style={{ width: "100%", display: "flex" }}
          data={plantsData?.seePlantsFeed}
          keyExtractor={(plant) => "" + plant.id}
          renderItem={renderPhoto}
        />
      )}
      {!searchScreen && (
        <LinkBox onPress={() => navigation.navigate("WholePlantsFeed")}>
          <Ionicons name="arrow-forward" size={16} />
          <LinkText>go to plants feed</LinkText>
        </LinkBox>
      )}
    </Container>
  );
};

export default PlantFeed;
