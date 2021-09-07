import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import { Styles } from "../Styles";
import Comment from "../components/Comment";
import { FlatList, KeyboardAvoidingView, Text } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";
import useMe from "../hook/useMe";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

const CommentContainer = styled.View`
  width: 92%;
  flex: 1;
  padding-top: 10px;
`;

const PayloadContainer = styled.View`
  width: 94%;
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Payload = styled.TextInput`
  width: 90%;
  padding: 7px;
  background-color: ${Styles.contentBg};
  border: ${Styles.conteBorder};
  border-radius: 10px;
  font-size: 13px;
`;
const SendButton = styled.TouchableOpacity``;

const SEE_COMMENTS = gql`
  query seeComments($id: Int!, $offset: Int) {
    seeComments(id: $id, offset: $offset) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

const CREATE_COMMENT = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;

export default ({ route }) => {
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const { data: userData } = useMe();
  const [refreshing, setRefreshing] = useState(false);

  

  const {
    data,
    loading: commentLoading,
    fetchMore,
    refetch,
  } = useQuery(SEE_COMMENTS, {
    variables: {
      id: route?.params?.photoId,
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const createCommentUpdate = (cache, result) => {
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const { payload } = getValues();

      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          username: userData?.me?.username,
          avatar: userData?.me?.avatar,
        },
      };
      setValue("payload", "");

      const commentFragment = cache.writeFragment({
        fragment: gql`
          fragment NewComment on Comment {
            createdAt
            id
            payload
            isMine
            user {
              username
              avatar
            }
          }
        `,
        data: newComment,
      });

      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          seeComments(prev) {
            console.log(prev);
            // return commentFragment;
          },
        },
      });

      cache.modify({
        id: `Photo:${route?.params?.photoId}`,
        fields: {
          // comments(prev) {
          //   console.log("++++++++++++++++++++++++++");
          //   console.log(prev);
          //   return [...prev, commentFragment];
          // },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };

  const [createCommentMutation, { loading }] = useMutation(CREATE_COMMENT, {
    update: createCommentUpdate,
  });

  const onValid = (data) => {
    const { payload } = data;
    if (loading && payload) {
      return;
    }
    createCommentMutation({
      variables: {
        photoId: route?.params?.photoId,
        payload,
      },
    });
  };

  useEffect(() => {
    register("payload");
  }, [register]);

  //FIXME: 댓글달면 다른사진에서도 보임

  const renderItem = ({ item: comments }) => (
    <Comment {...comments} photoId={route?.params?.photoId} />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Styles.background }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
    >
      <ScreenLayout loading={commentLoading}>
        <CommentContainer>
          <FlatList
            data={data?.seeComments || []}
            renderItem={renderItem}
            onEndReachedThreshold={0.05}
            onEndReached={() =>
              fetchMore({
                variables: {
                  offset: data?.seeComments?.length,
                },
              })
            }
            refreshing={refreshing}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
            keyExtractor={(comment) => "" + comment.id}
            style={{ width: "100%" }}
          />
        </CommentContainer>
        <PayloadContainer>
          <Payload
            placeholder="댓글 입력"
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            onSubmitEditing={handleSubmit(onValid)}
            returnKeyType="done"
            onChangeText={(text) => setValue("payload", text)}
            value={watch("payload")}
          />
          <SendButton
            onPress={handleSubmit(onValid)}
            disabled={!Boolean(watch("payload"))}
          >
            <Ionicons
              name="send"
              color={!Boolean(watch("payload")) ? "#888" : "#333"}
              size={22}
            />
          </SendButton>
        </PayloadContainer>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};
