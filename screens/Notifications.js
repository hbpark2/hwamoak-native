import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import styled from "styled-components/native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { NOTIFICATION_FRAGMENT } from "../fragments";
import ScreenLayout from "../components/ScreenLayout";
import NotificationItem from "../components/NotificationItem";

const SEE_NOTIFICATIONS = gql`
  query seeNotifications($id: Int) {
    seeNotifications(id: $id) {
      ...NotificationFragment
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

const READ_NOTIFICATION = gql`
  mutation readNotification($id: Int!) {
    readNotification(id: $id) {
      ok
    }
  }
`;

export default ({ route }) => {
  const { data, loading, fetchMore, refetch } = useQuery(SEE_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const notificationUpdate = (cache, result) => {
    const {
      data: {
        readNotification: { ok },
      },
    } = result;

    //FIXME: read notification 캐시
    if (ok) {
      const userId = `User:${route?.params?.userId}`;
      cache.modify({
        id: userId,
        fields: {
          NotificationsReceived(prev) {
            prev.map((item) => (item.read = true));
          },
        },
      });
    }
  };

  const [readNotificationMutation, { loading: readLoading }] = useMutation(
    READ_NOTIFICATION,
    { update: notificationUpdate }
  );

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item: notification }) => {
    return <NotificationItem {...notification} />;
  };

  useEffect(() => {
    const makeReadNotification = data?.seeNotifications?.filter(
      (item) => !item.read
    );

    if (!readLoading && makeReadNotification) {
      makeReadNotification.map((item) => {
        return readNotificationMutation({
          variables: {
            id: item.id,
          },
        });
      });
    }
  }, [data]);

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        // onEndReachedThreshold={0.05}
        // onEndReached={() =>
        //   fetchMore({
        //     variables: {
        //       offset: data?.seeNotifications?.length,
        //     },
        //   })
        // }
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        data={data?.seeNotifications}
        keyExtractor={(notification) => "" + notification.id}
        renderItem={renderItem}
      />
    </ScreenLayout>
  );
};
