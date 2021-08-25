import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hook/useMe";
import { Styles } from "../Styles";
import { Ionicons } from "@expo/vector-icons";

const MessageContainer = styled.View`
  padding: 0 10px;
  flex-direction: ${(props) => (props.outGoing ? "row-reverse" : "row")};
  align-items: center;
`;
const Author = styled.View`
  /* flex-direction: row; */
  margin-bottom: 10px;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 25px;
  margin: 0 auto 3px;
`;
const Username = styled.Text`
  color: #333;
  font-weight: 600;
`;
const Message = styled.Text`
  color: #333;
  background-color: rgb(246, 245, 232);
  padding: 5px 10px;
  border-radius: 10px;
  overflow: hidden;
  font-size: 16px;
  margin: 0 10px;
`;

const TextInput = styled.TextInput`
  width: 90%;
  padding: 10px;
  /* background-color: rgb(246, 245, 232); */
  border: 1px solid rgb(219, 219, 219);
  border-color: rgba(0, 0, 0, 0.3);
  border-radius: 25px;
  color: rgba(0, 0, 0, 0.7);
  margin-right: 10px;
`;

const InputContainer = styled.View`
  width: 95%;
  margin: 20px 0 50px;
  flex-direction: row;
  align-items: center;
`;

const SendButton = styled.TouchableOpacity``;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
      }
    }
  }
`;

const Room = ({ route, navigation }) => {
  const { data: meData } = useMe();

  const { register, setValue, handleSubmit, getValues, watch } = useForm();

  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;

    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        payload: message,
        user: {
          username: meData.me.username,
          avatar: meData.me.avatar,
        },
        read: true,
        __typename: "Message",
      };

      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              username
              avatar
            }
            read
          }
        `,
        data: messageObj,
      });

      const roomId = `Room:${route?.params?.id}`;
      console.log(roomId);
      cache.modify({
        id: `Room:${route.params.id}`,
        fields: {
          messages(prev) {
            console.log(prev);
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );

  const { data, loading } = useQuery(ROOM_QUERY, {
    variables: {
      id: route?.params?.id,
    },
  });

  const onValid = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: message,
          roomId: route?.params?.id,
        },
      });
    }
  };

  useEffect(() => {
    register("message", { required: true });
  }, [register]);

  useEffect(() => {
    navigation.setOptions({
      title: `${route?.params?.talkingTo?.username}`,
    });
  }, []);

  const renderItem = ({ item: message }) => (
    <MessageContainer
      outGoing={message.user.username !== route?.params?.talkingTo?.username}
    >
      <Author>
        <Avatar source={{ uri: message.user.avatar }} />
        <Username>{message.user.username}</Username>
      </Author>
      <Message>{message.payload}</Message>
    </MessageContainer>
  );

  const messages = [...(data?.seeRoom?.messages ?? [])];
  messages.reverse();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#333" }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
    >
      <ScreenLayout loading={loading}>
        <FlatList
          style={{ width: "100%", paddingVertical: 10 }}
          inverted
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }}></View>}
          data={messages}
          keyExtractor={(message) => "" + message.id}
          renderItem={renderItem}
        />
        <InputContainer>
          <TextInput
            placeholder="Write a message ..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            returnKeyLabel="Send Message"
            returnKeyType="send"
            onChangeText={(text) => setValue("message", text)}
            onSubmitEditing={handleSubmit(onValid)}
            value={watch("message")}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("message"))}
          >
            <Ionicons
              name="send"
              color={!Boolean(watch("message")) ? "#888" : "#333"}
              size={22}
            />
          </SendButton>
        </InputContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};

export default Room;
