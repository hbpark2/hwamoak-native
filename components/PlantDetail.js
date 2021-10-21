import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import Swiper from "react-native-swiper";

const TOGGLE_PLANT_LIKE_MUTATION = gql`
  mutation togglePlantLike($id: Int!) {
    togglePlantLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.ScrollView`
  /* padding: 10px; */
  /* margin: 15px 15px 0; */
  /* background-color: rgb(246, 245, 232);
  border: 1px solid rgb(219, 219, 219);
  border-radius: 4px; */
`;

const Header = styled.TouchableOpacity`
  padding: 10px 10px 0;
`;

const TitleText = styled.Text`
  font-weight: 600;
  font-size: 18px;
`;

const CaptionContainer = styled.View`
  padding: 5px 10px;
`;
const CaptionText = styled.Text`
  margin-top: 6px;
`;

const File = styled.Image`
  max-width: 100%;
  max-height: 500px;
  margin: 0 auto 10px;
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

const ExtraContainer = styled.View`
  padding: 10px;
`;

const PlantDetail = ({
  id,
  user,
  title,
  caption,
  images,
  isLiked,
  plantLikes,
  fullView,
}) => {
  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 350);

  // useEffect(() => {
  //   if (images[0].file) {
  //     Image.getSize(images[0].file, (width, height) => {
  //       setImageHeight(height);
  //     });
  //   }
  // }, [images[0].file]);

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        togglePlantLike: { ok },
      },
    } = result;
    if (ok) {
      console.log("time to update the cache");

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

  useEffect(() => {
    navigation.setOptions({
      title,
    });
  }, []);

  return (
    <Container>
      {/* <Header>
        <TitleText>{title}</TitleText>
      </Header> */}

      <Swiper
        style={{ height: imageHeight }}
        showsPagination={true}
        dotColor="rgba(255,255,255,0.5)"
        activeDotColor="rgba(255,255,255,1)"
      >
        {images?.map((item, index) => (
          <File
            key={index}
            resizeMode="cover"
            style={{
              width,
              height: imageHeight,
            }}
            source={{ uri: item.file }}
          />
        ))}
      </Swiper>

      {/* <File
        resizeMode="cover"
        source={{ uri: images[0]?.file }}
        style={{
          width,
          height: imageHeight,
        }}
      /> */}
      <CaptionContainer>
        <CaptionText>
          {caption.split("<br />").map((line, index) => {
            let makeSpanKey = `line${index}`;
            return (
              <Text key={makeSpanKey}>
                {line}
                {"\n"}
              </Text>
            );
          })}
        </CaptionText>
      </CaptionContainer>

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
};

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

export default PlantDetail;
