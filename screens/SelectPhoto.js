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
import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "extract-files";

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

const SelectWrap = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 5px 10px;
`;

const SelectBtn = styled.TouchableOpacity`
  align-items: center;
  margin-left: 10px;
`;

const SelectText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.color};
`;

const SelectPhoto = ({ navigation }) => {
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [chosenPhoto, setChosenPhoto] = useState([]);
  const [selectState, setSelectState] = useState("one");
  const numColumns = 4;
  const { width } = useWindowDimensions();

  const onSelectStateChange = (state) => {
    setSelectState(state);
    // sectionState가 one 일 때 전에
    // 담겨있던 chosenPhoto에서
    // 하나만 남기고 삭제
    setChosenPhoto([chosenPhoto[0]]);
  };

  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();

    setPhotos(photos);
    if (selectState === "one") {
      setChosenPhoto([photos[0]?.uri]);
    } else {
      // setChosenPhoto([...chosenPhoto, photos[0]?.uri]);
    }
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

  const choosePhoto = (uri) => {
    // console.log(chosenPhoto);
    if (selectState === "one") {
      setChosenPhoto([uri]);
    } else {
      //이미 같은게 있을때 삭제
      if (chosenPhoto.some((item) => item === uri)) {
        if (chosenPhoto.length > 1) {
          setChosenPhoto((prev) => prev.filter((item) => item !== uri));
        }
      } else {
        setChosenPhoto([...chosenPhoto, uri]);
      }
    }
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

  const goToUpload = () => {
    navigation.navigate("UploadForm", {
      file: chosenPhoto,
    });
  };

  const HeaderRight = () => (
    <>
      <TouchableOpacity onPress={goToUpload}>
        <HeaderRightText>Next</HeaderRightText>
      </TouchableOpacity>
    </>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [chosenPhoto]);

  useEffect(() => {
    getPermissions();
  }, []);

  return (
    <Container>
      <StatusBar hidden={false} />
      <Top>
        {chosenPhoto.length > 0 ? (
          <Image
            source={{ uri: chosenPhoto[chosenPhoto.length - 1] }}
            style={{ width, height: "100%" }}
          />
        ) : null}
      </Top>
      <Bottom>
        <SelectWrap>
          <SelectBtn onPress={() => onSelectStateChange("one")}>
            <Ionicons
              name={selectState === "one" ? "square" : "square-outline"}
              size={24}
              color={selectState === "one" ? Styles.blue : "#333"}
            />
            <SelectText color={selectState === "one" ? Styles.blue : "#333"}>
              한장 선택
            </SelectText>
          </SelectBtn>
          <SelectBtn onPress={() => onSelectStateChange("several")}>
            <Ionicons
              name={selectState === "several" ? "albums" : "albums-outline"}
              size={24}
              color={selectState === "several" ? Styles.blue : "#333"}
            />
            <SelectText
              color={selectState === "several" ? Styles.blue : "#333"}
            >
              여러장 선택
            </SelectText>
          </SelectBtn>
        </SelectWrap>
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
