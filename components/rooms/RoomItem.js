import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import useMe from "../../hook/useMe";
import { Styles } from "../../Styles";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";

const RoomContainer = styled.TouchableOpacity`
  /* background-color: ${(props) => props.theme.background}; */
  width: 100%;
  padding: 15px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Column = styled.View`
  color: #333;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border-radius: 25px;
`;

const Data = styled.View``;

const UnreadDot = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${Styles.blue};
  border-radius: 5px;
`;

const Username = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const UnreadText = styled.Text`
  color: #333;
  margin-top: 2px;
  font-weight: 500;
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

const RoomItem = ({ users, unreadTotal, id }) => {
  const { data: meData } = useMe();
  const navigation = useNavigation();
  const talkingTo = users.find(
    (user) => user.username !== meData?.me?.username
  );

  const { data, loading, subscribeToMore } = useQuery(ROOM_QUERY, {
    variables: {
      id: id,
    },
  });

  const goToRoom = () => {
    navigation.navigate("Room", {
      id,
      talkingTo,
    });
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
        id: `Room:${id}`,
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
          unreadTotal(prev) {
            return;
          },
        },
      });
    }
  };

  useEffect(() => {
    if (data) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id,
        },
        updateQuery,
      });
    }
  }, [data]);

  return (
    <RoomContainer onPress={goToRoom}>
      <Column>
        <Avatar source={{ uri: talkingTo.avatar }} />
        <Data>
          <Username>{talkingTo.username}</Username>
          <UnreadText>
            {unreadTotal} unread
            {unreadTotal === 1 ? " message" : " messages"}
          </UnreadText>
        </Data>
      </Column>
      <Column>{unreadTotal !== 0 ? <UnreadDot /> : null}</Column>
    </RoomContainer>
  );
};

export default RoomItem;
