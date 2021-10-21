import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { Styles } from "../Styles";
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";

const Container = styled.View`
  flex: 1;
  /* align-items: center;
  justify-content: center; */
  background-color: ${(props) => props.theme.background};
`;

const HeaderRightText = styled.Text`
  color: ${Styles.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;

const PhotoAlbum = ({ setModalVisible, setValue }) => {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [chosenPhoto, setChosenPhoto] = useState([]);
  const { width } = useWindowDimensions();
  const numColumns = 4;

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync({ first: 40 });
    setPhotos(photos);
    setChosenPhoto([photos[0]?.uri]);
  };

  //FIXME: 17.4
  //안드로이드 accessPrivileges가 없기 때문에
  //status === "undetermined" 와 granted를 활용해야한다

  const getPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();

    if (accessPrivileges === "none") {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();

      if (accessPrivileges !== "none") {
        setOk(true);
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      setOk(true);
      getPhotos();
    }
  };

  const choosePhoto = (uri) => {
    setChosenPhoto([uri]);
  };

  // MAKE FETCHMORE FUNCTION
  const fetchMore = async () => {
    const lastId = photos[photos.length - 1].id;
    const { assets } = await MediaLibrary.getAssetsAsync({
      after: lastId,
      // first: 20,
    });

    let photoArr = photos;
    photoArr.push(...assets);
    setPhotos(photoArr);
  };

  const renderItem = ({ item: photo }) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / numColumns, height: 100 }}
      />

      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          //chosenPhoto 내에 같은게 있을 때 푸른색
          color={
            chosenPhoto?.some((item) => item === photo.uri)
              ? Styles.blue
              : "#ffe"
          }
        />
      </IconContainer>
    </ImageContainer>
  );

  const goBackToEditProfile = () => {
    setValue("avatar", chosenPhoto[0]);
    setModalVisible(false);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <Container>
      <TouchableOpacity onPress={goBackToEditProfile} style={{ padding: 20 }}>
        <HeaderRightText>선택</HeaderRightText>
      </TouchableOpacity>
      <FlatList
        data={photos}
        numColumns={numColumns}
        style={{ height: 100 }}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderItem}
        onEndReachedThreshold={0.02}
        onEndReached={fetchMore}
      />
    </Container>
  );
};

export default PhotoAlbum;
