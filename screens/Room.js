import React, { useEffect } from "react";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../components/ScreenLayout";
import useMe from "../hook/useMe";
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

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const READ_MESSAGE_MUTATION = gql`
  mutation readMessage($id: Int!) {
    readMessage(id: $id) {
      ok
      id
    }
  }
`;

const ROOM_QUERY = gql`
  query seeRoom($id: Int, $userId: Int) {
    seeRoom(id: $id, userId: $userId) {
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

      cache.modify({
        id: `Room:${route.params.id ? route.params.id : data?.seeRoom?.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  const updateRoomsQuery = (cache, result) => {
    const {
      data: {
        readMessage: { ok },
      },
    } = result;

    if (ok) {
      cache.modify({
        id: `Room:${route.params.id ? route.params.id : data?.seeRoom?.id}`,
        fields: {
          unreadTotal(prev) {
            return 0;
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

  const [readMessageMutation, { loading: readLoading }] = useMutation(
    READ_MESSAGE_MUTATION,
    {
      update: updateRoomsQuery,
    }
  );

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: route?.params?.id
      ? {
          id: route?.params?.id,
        }
      : {
          userId: route?.params?.talkingTo?.id,
        },
  });

  //SEND MESSAGE
  const onValid = ({ message }) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: route?.params?.id
          ? {
              payload: message,
              roomId: route?.params?.id,
            }
          : {
              payload: message,
              roomId: data?.seeRoom?.id,
            },
      });
    }
  };

  const client = useApolloClient();

  const updateQuery = (prevQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: message },
      },
    } = options;

    if (message.id) {
      const messageFragment = client.cache.writeFragment({
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
        data: message,
      });

      client.cache.modify({
        id: `Room:${route.params.id ? route.params.id : data?.seeRoom?.id}`,
        fields: {
          messages(prev) {
            const existingMessage = prev.find(
              (aMessage) => aMessage.__ref === messageFragment.__ref
            );
            if (existingMessage) {
              return prev;
            }
            return [...prev, messageFragment];
          },
        },
      });
    }
  };

  useEffect(() => {
    const toReadMessage = data?.seeRoom?.messages?.filter(
      (item) => item.user.username === route?.params?.talkingTo?.username
    );
    const makeReadMessage = toReadMessage?.filter((item) => !item.read);

    if (!readLoading && makeReadMessage) {
      makeReadMessage.map((item) => {
        return readMessageMutation({
          variables: {
            id: item.id,
          },
        });
      });
    }
  }, [data]);

  useEffect(() => {
    if (data?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: route?.params?.id
          ? {
              id: route?.params?.id,
            }
          : {
              id: data?.seeRoom?.id,
            },
        updateQuery,
      });
    }
  }, [data]);

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
            placeholder="메시지 입력 ..."
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
