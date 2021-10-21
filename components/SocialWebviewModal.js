import React from "react";
import { StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";
import SocialWebview from "./SocialWebview";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

const SocialWebviewModal = ({ visible, source, closeSocialModal }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      style={styles.container}
    >
      <SocialWebview
        source={{ uri: source }}
        closeSocialModal={closeSocialModal}
      />
    </Modal>
  );
};
export default SocialWebviewModal;
