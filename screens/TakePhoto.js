import { Camera } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
`;

const Actions = styled.View`
  flex: 0.35;
  align-items: center;
  justify-content: space-around;
  background-color: #fffef2;
  padding: 0px 50px;
`;

const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TakePhotoBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  opacity: 0.5;
`;

const SliderContainer = styled.View``;

const GetPermissionsButton = styled.TouchableOpacity``;

export default function TakePhoto() {
  const [ok, setOk] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  const getPermissions = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    setOk(granted);
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const onCameraSwitch = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const onZoomValueChange = (e) => {
    setZoom(e);
  };

  const onFlashChange = () => {
    setFlashMode(Camera.Constants.FlashMode.on);
  };

  return (
    <Container>
      {/* {!ok && (
        <GetPermissionsButton onPress={() => getPermissions()}>
          <Text>카메라 권한을 허용해주세요</Text>
        </GetPermissionsButton>
      )} */}

      <Camera type={cameraType} style={{ flex: 1 }} zoom={zoom} />
      <Actions>
        <SliderContainer>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#333"
            maximumTrackTintColor="#aaa"
            onValueChange={onZoomValueChange}
          />
        </SliderContainer>
        <ButtonsContainer>
          <TakePhotoBtn />
          <TouchableOpacity onPress={onCameraSwitch}>
            <Ionicons
              size={30}
              color="#333"
              name={
                cameraType === Camera.Constants.Type.front
                  ? "camera-reverse"
                  : "camera"
              }
            />
          </TouchableOpacity>
        </ButtonsContainer>
      </Actions>
    </Container>
  );
}
