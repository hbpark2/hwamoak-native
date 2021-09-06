import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components/native";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import Comments from "./Comments";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View``;

const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 25px;
  margin-right: 10px;
`;
const Username = styled.Text`
  font-weight: 600;
`;
const File = styled.Image`
  min-height: 300px;
  max-height: 450px;
`;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  margin-left: 5px;
`;

const Likes = styled.Text`
  margin: 7px 0;
  font-weight: 600;
`;

const ExtraContainer = styled.View`
  padding: 10px;
`;

function Photo({
  id,
  user,
  caption,
  comments,
  commentNumber,
  file,
  isLiked,
  likes,
  fullView,
}) {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 350);

  // useEffect(() => {
  //   if (file) {
  //     Image.getSize(file, (width, height) => {
  //       setImageHeight(height);
  //     });
  //   }
  // }, [file]);

  const updateToggleLike = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev) {
            return !prev;
          },
          likes(prev) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });

  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user?.username,
      id: user?.id,
    });
  };

  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar resizeMode="cover" source={{ uri: user?.avatar }} />
        <Username>{user?.username}</Username>
      </Header>

      <File
        resizeMode="cover"
        style={{
          width,
          height: imageHeight,
        }}
        source={{ uri: file }}
      />
      <ExtraContainer>
        <Actions>
          <Action onPress={toggleLikeMutation}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : "#333"}
              size={18}
            />
          </Action>
          <Action
            onPress={() =>
              navigation.navigate("Comments", {
                photoId: id,
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={18} />
          </Action>
        </Actions>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Likes", {
              photoId: id,
            })
          }
        >
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <Username>{user?.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption || ""}</CaptionText>
        </Caption>

        <Comments id={id} commentNumber={commentNumber} />
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

export default Photo;
