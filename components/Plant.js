import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";

const TOGGLE_PLANT_LIKE_MUTATION = gql`
  mutation togglePlantLike($id: Int!) {
    togglePlantLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.TouchableOpacity`
  padding: 10px;
  margin: 15px 10px 0;
  background-color: rgb(246, 245, 232);
  border: 1px solid rgb(219, 219, 219);
  border-radius: 4px;
`;

const Header = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const TitleText = styled.Text`
  font-weight: 600;
`;

const File = styled.Image`
  width: 130px;
  height: 130px;
  margin: 10px auto;
  border-radius: 65px;
`;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;

const Likes = styled.Text`
  margin: 4px 0;
  font-weight: 600;
`;

const ExtraContainer = styled.View``;

function Plant({
  id,
  user,
  title,
  caption,
  images,
  isLiked,
  plantLikes,
  fullView,
  searchScreen,
}) {
  const navigation = useNavigation();

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        togglePlantLike: { ok },
      },
    } = result;
    if (ok) {
      console.log("time to update the cache ");

      const plantId = `Plants:${id}`;
      cache.modify({
        id: plantId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          plantLikes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  const [togglePlantLikeMutation] = useMutation(TOGGLE_PLANT_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  const goToPlant = () => {
    navigation.navigate("PlantScreen", {
      plantId: id,
    });
  };

  return (
    <Container onPress={goToPlant} searchScreen={searchScreen}>
      <Header>
        <TitleText>{title}</TitleText>
      </Header>
      <File resizeMode="cover" source={{ uri: images[0]?.file }} />
      <ExtraContainer>
        <Actions>
          <Action onPress={togglePlantLikeMutation}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : "#333"}
              size={18}
            />
          </Action>
        </Actions>
        <Likes>{plantLikes === 1 ? "1 like" : `${plantLikes} likes`}</Likes>
      </ExtraContainer>
    </Container>
  );
}

// Photo.propTypes = {
//   id: PropTypes.number.isRequired,
//   user: PropTypes.shape({
//     avatar: PropTypes.string,
//     username: PropTypes.string.isRequired,
//   }),
//   caption: PropTypes.string,
//   file: PropTypes.string.isRequired,
//   isLiked: PropTypes.bool.isRequired,
//   likes: PropTypes.number,
//   commentNumber: PropTypes.number,
// };

export default Plant;
