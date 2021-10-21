import { gql } from "@apollo/client";

export const PHOTO_FRAGMENT = gql`
  fragment PhotoFragment on Photo {
    id
    images {
      file
    }
    likes
    commentNumber
    isLiked
    caption
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on Comment {
    id
    user {
      username
      avatar
    }
    payload
    isMine
    createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
    avatar
    isFollowing
    isMe
  }
`;

export const FEED_PHOTO = gql`
  fragment FeedPhoto on Photo {
    ...PhotoFragment
    user {
      id
      username
      avatar
    }
    caption
    createdAt
    isMine
  }
  ${PHOTO_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomParts on Room {
    id
    unreadTotal
    users {
      id
      avatar
      username
    }
  }
`;

export const PLANT_FRAGMENT = gql`
  fragment PlantFragment on Plants {
    id
    title
    caption
    water
    sunlight
    temperatureMin
    temperatureMax
    plantDivision
    plantClass
    plantOrder
    plantFamily
    plantGenus
    plantSpecies
    plantHome
    plantHabitat
    plantLikes
    isLiked
    images {
      file
    }
  }
`;

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFragment on Notification {
    id
    read
    notificationType
    sendUser {
      avatar
      username
    }
    photo {
      id
      images {
        file
      }
      caption
    }
  }
`;
