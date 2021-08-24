import React, { useEffect } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

import { gql, useQuery } from "@apollo/client";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Plant from "../components/Plant";
import PlantInPlantsFeed from "../components/PlantInPlantsFeed";

const Container = styled.View`
  flex: 1;
  width: ${(props) => props?.width}px;
  background-color: ${(props) => props.theme.background};
`;
const LinkBox = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  padding: 15px 15px 0;
  align-items: flex-end;
  justify-content: flex-end;
`;
const LinkText = styled.Text`
  color: #333;
  font-weight: 600;
  margin-bottom: 2px;
  margin-left: 5px;
`;

const PLANTS_FEED_QUERY = gql`
  query seeWholePlantsFeed($lastId: Int) {
    seeWholePlantsFeed(lastId: $lastId) {
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

const WholePlantsFeed = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const {
    data: plantsData,
    loading,
    refetch,
  } = useQuery(PLANTS_FEED_QUERY, {
    // skip: 0,
    variables: {
      lastId: 0,
    },
  });

  const renderPhoto = ({ item: plant }) => {
    return <PlantInPlantsFeed {...plant} />;
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          style={{ maxHeight: 35 }}
          resizeMode="contain"
          source={require("../assets/logo.png")}
        />
      ),
    });
  }, []);

  return (
    <Container width={width}>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={{ width: "100%", display: "flex" }}
        data={plantsData?.seeWholePlantsFeed}
        keyExtractor={(plant) => "" + plant.id}
        renderItem={renderPhoto}
      />
    </Container>
  );
};

export default WholePlantsFeed;
