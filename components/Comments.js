import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import { COMMENT_FRAGMENT } from "../fragments";
import { Styles } from "../Styles";
import Comment from "./Comment";

const CommentsContainer = styled.View``;
const CommentCount = styled.TouchableOpacity`
  margin: 10px 0;
  opacity: 0.7;
  font-weight: 600;
  font-size: 11px;
`;
const CommentCountText = styled.Text``;

const SEE_COMMENTS = gql`
  query seeComments($id: Int!) {
    seeComments(id: $id) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

const Comments = ({ id, commentNumber }) => {
  const navigation = useNavigation();
  const { data, loading: commentLoading } = useQuery(SEE_COMMENTS, {
    variables: {
      id,
    },
  });

  return (
    !commentLoading && (
      <CommentsContainer>
        <CommentCount>
          <CommentCountText
            onPress={() =>
              navigation.navigate("Comments", {
                photoId: id,
                comments: data?.seeComments,
              })
            }
          >
            {commentNumber && commentNumber}개의 댓글 모두보기
          </CommentCountText>
        </CommentCount>

        <Comment {...data?.seeComments[0]} photoId={id} />
      </CommentsContainer>
    )
  );
};

export default Comments;
