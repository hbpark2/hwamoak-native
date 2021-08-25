import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { ROOM_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import RoomItem from "../components/rooms/RoomItem";

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      ...RoomParts
    }
  }
  ${ROOM_FRAGMENT}
`;

const Rooms = () => {
  const { data, loading } = useQuery(SEE_ROOMS_QUERY);

  const renderItem = ({ item: room }) => {
    return <RoomItem {...room} />;
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          />
        )}
        style={{ width: "100%" }}
        data={data?.seeRooms}
        keyExtractor={(room) => "" + room.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
};

export default Rooms;
