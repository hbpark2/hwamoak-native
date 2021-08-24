import React, { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Styles } from "../Styles";

const Container = styled.View`
  flex: 1;
  /* align-items: center;
  justify-content: center; */
  /* background-color: ${(props) => props.theme.background}; */
`;

const Top = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;
const Bottom = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
`;

const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 5px;
  right: 0px;
`;

const HeaderRightText = styled.Text`
  color: ${Styles.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 7px;
`;

const SelectPhoto = ({ navigation }) => {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [chosenPhoto, setChosenPhoto] = useState("");

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
    setChosenPhoto(photos[0]?.uri);
  };

  //FIXME: 17.4
  //안드로이드 accessPrivileges가 없기 때문에
  //status === "undetermined" 와 granted를 활용해야한다

  const getPermissions = async () => {
    const { accessPrivileges, canAskAgain } =
      await MediaLibrary.getPermissionsAsync();

    if (accessPrivileges === "none") {
      // console.log("have to Request : /////////");
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

  useEffect(() => {
    getPermissions();
  }, []);

  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("UploadForm", {
          file: chosenPhoto,
        })
      }
    >
      <HeaderRightText>Next</HeaderRightText>
    </TouchableOpacity>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [chosenPhoto]);

  const numColumns = 4;

  const { width } = useWindowDimensions();

  const choosePhoto = (uri) => {
    setChosenPhoto(uri);
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
          color={photo.uri === chosenPhoto ? Styles.blue : "#ffe"}
        />
      </IconContainer>
    </ImageContainer>
  );

  return (
    <Container>
      <StatusBar hidden={false} />
      <Top>
        {chosenPhoto !== "" ? (
          <Image
            source={{ uri: chosenPhoto }}
            style={{ width, height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={(photo) => "" + photo.id}
          renderItem={renderItem}
          onEndReachedThreshold={0.02}
          onEndReached={fetchMore}
        />
      </Bottom>
    </Container>
  );
};

export default SelectPhoto;
