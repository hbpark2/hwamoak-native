import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, Text } from "react-native";
import styled from "styled-components/native";
import { Styles } from "../Styles";
const CommentContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const CommentWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 5px 0;
`;
const UserBox = styled.TouchableOpacity`
  flex-direction: row;

  align-items: center;
  margin-right: 5px;
`;
const Avatar = styled.Image`
  width: 20px;
  height: 20px;
  border-radius: 25px;
  margin-right: 10px;
`;

const Username = styled.Text`
  font-weight: 600;
`;
const CommentCaption = styled.Text``;
const DeleteButton = styled.TouchableOpacity`
  margin-right: 5px;
`;
const DeleteButtonText = styled.Text``;

const HashTag = styled.Text`
  color: ${Styles.blue};
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const Comment = ({ id, photoId, isMine, payload, user, createdAt }) => {
  const navigation = useNavigation();

  const updateDeleteComment = (cache, result) => {
    const {
      data: {
        deleteComment: { ok },
      },
    } = result;
    if (ok) {
      //evict : 삭제
      cache.evict({ id: `Comment:${id}` });
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          commentNumber(prev) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT, {
    variables: { id },
    update: updateDeleteComment,
  });

  const onDeleteClick = () => {
    Alert.alert("댓글 삭제", "댓글을 삭제하시겠습니까?", [
      {
        text: "닫기",
      },
      {
        text: "삭제",
        onPress: () => deleteCommentMutation(),
        style: "destructive",
      },
    ]);
  };

  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user?.username,
      id: user?.id,
    });
  };
  return (
    <CommentContainer>
      <CommentWrap>
        <UserBox onPress={goToProfile}>
          <Avatar resizeMode="cover" source={{ uri: user?.avatar }} />
          <Username>{user?.username}</Username>
        </UserBox>
        <CommentCaption>
          {payload?.split(" ").map((word, index) =>
            payload?.length > 1 && /#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g.test(word) ? (
              <React.Fragment key={index}>
                <HashTag to={`/hastags/${word}`}>{word}</HashTag>{" "}
              </React.Fragment>
            ) : (
              <Text key={index}>{word}</Text>
            )
          )}
        </CommentCaption>
      </CommentWrap>
      {isMine && (
        <DeleteButton onPress={onDeleteClick}>
          <DeleteButtonText>삭제</DeleteButtonText>
        </DeleteButton>
      )}
    </CommentContainer>
  );
};

export default Comment;
