import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { FlatList } from "react-native";
import PlantInPlantsFeed from "../components/PlantInPlantsFeed";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT, PLANT_FRAGMENT } from "../fragments";

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
  query seeWholePlantsFeed($offset: Int!) {
    seeWholePlantsFeed(offset: $offset) {
      ...PlantFragment
      user {
        username
        avatar
      }
    }
  }
  ${PLANT_FRAGMENT}
`;

export default ({ navigation }) => {
  const { data, loading, refetch, fetchMore } = useQuery(PLANTS_FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({ item: plant }) => {
    return <PlantInPlantsFeed {...plant} />;
  };

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        numColumns={2}
        data={data?.seeWholePlantsFeed || []}
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeWholePlantsFeed?.length,
            },
          })
        }
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", display: "flex" }}
        keyExtractor={(plant) => "" + plant.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </ScreenLayout>
  );
};
