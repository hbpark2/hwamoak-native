// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useEffect } from "react";
// import {
//   ActivityIndicator,
//   FlatList,
//   Image,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import { isLoggedInVar, tokenVar } from "../apollo";
// import styled from "styled-components/native";
// import DismissKeyboard from "../components/DismissKeyboard";
// import { useForm } from "react-hook-form";
// import { gql, useLazyQuery } from "@apollo/client";

// const Container = styled.View`
//   flex: 1;
//   align-items: center;
//   justify-content: center;
//   background-color: ${(props) => props.theme.background};
// `;

// const MessageContainer = styled.View`
//   justify-content: center;
//   align-items: center;
//   flex: 1;
// `;

// const MessageText = styled.Text`
//   margin-top: 15px;
//   font-weight: 600;
// `;

// const Input = styled.TextInput`
//   width: ${(props) => props.width / 2}px;
//   background-color: #333;
//   border: none;
//   border-radius: 10px;
//   padding: 5px 10px;
//   color: #fff;
// `;

// const SEARCH_PHOTOS = gql`
//   query searchPhotos($keyword: String!) {
//     searchPhotos(keyword: $keyword) {
//       ok
//       error
//       photos {
//         id
//         file
//         caption
//       }
//     }
//   }
// `;

// export default function Search({ navigation }) {
//   const numColumns = 4;
//   const { width } = useWindowDimensions();
//   const { setValue, register, watch, handleSubmit } = useForm();
//   const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PHOTOS);

//   const onValid = ({ keyword }) => {
//     startQueryFn({
//       variables: {
//         keyword,
//       },
//     });
//   };

//   const SearchBox = () => (
//     <Input
//       width={width}
//       placeholderTextColor="#fff"
//       placeholder="Search photos"
//       autoCapitalize="none"
//       returnKeyLabel="Search"
//       returnKeyType="search"
//       autoCorrect={false}
//       onChangeText={(text) => setValue("keyword", text)}
//       onSubmitEditing={handleSubmit(onValid)}
//     />
//   );

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: SearchBox,
//     });

//     register("keyword", {
//       required: true,
//       minLength: 3,
//     });
//   }, []);

//   const renderItem = ({ item: photo }) => (
//     <TouchableOpacity
//       onPress={() =>
//         navigation.navigate("Photo", {
//           photoId: photo.id,
//         })
//       }
//     >
//       <Image
//         source={{ uri: photo.file }}
//         style={{ width: width / numColumns, height: 100 }}
//       />
//     </TouchableOpacity>
//   );

//   return (
//     <DismissKeyboard>
//       <Container>
//         {loading ? (
//           <MessageContainer>
//             <ActivityIndicator size="large" />
//             <MessageText>Searching...</MessageText>
//           </MessageContainer>
//         ) : null}
//         {!called ? (
//           <MessageContainer>
//             <MessageText>Search by keyword</MessageText>
//           </MessageContainer>
//         ) : null}

//         {data?.searchPhotos !== undefined ? (
//           data?.searchPhotos.length === 0 ? (
//             <MessageContainer>
//               <MessageText>Could not find anything.</MessageText>
//             </MessageContainer>
//           ) : (
//             <FlatList
//               numColumns={numColumns}
//               data={data?.searchPhotos?.photos}
//               keyExtractor={(photo) => "" + photo.id}
//               renderItem={renderItem}
//             />
//           )
//         ) : null}
//       </Container>
//     </DismissKeyboard>
//   );
// }

import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { useForm } from "react-hook-form";
import { gql, useLazyQuery } from "@apollo/client";
import PlantFeed from "./PlantFeed";
import Plant from "../components/Plant";

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.background};
`;

const MessageContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const MessageText = styled.Text`
  margin-top: 15px;
  font-weight: 600;
`;

const Input = styled.TextInput`
  width: ${(props) => props.width / 2}px;
  background-color: #333;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  color: #fff;
`;

const SEARCH_PLANTS = gql`
  query searchPlant($keyword: String!) {
    searchPlant(keyword: $keyword) {
      ok
      error
      plants {
        id
        title
        caption
        plantLikes
        isLiked
        images {
          file
        }
      }
    }
  }
`;

export default function Search({ navigation }) {
  const numColumns = 4;
  const { width } = useWindowDimensions();
  const { setValue, register, watch, handleSubmit } = useForm();
  const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_PLANTS);

  const onValid = ({ keyword }) => {
    startQueryFn({
      variables: {
        keyword,
      },
    });
  };

  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor="#fff"
      placeholder="Search Plant"
      autoCapitalize="none"
      returnKeyLabel="Search"
      returnKeyType="search"
      autoCorrect={false}
      onChangeText={(text) => setValue("keyword", text)}
      onSubmitEditing={handleSubmit(onValid)}
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });

    register("keyword", {
      required: true,
      minLength: 2,
    });
  }, []);

  const renderItem = ({ item: plant }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PlantScreen", {
          plantId: plant.id,
        })
      }
    >
      <Plant {...plant} />
    </TouchableOpacity>
  );

  return (
    <DismissKeyboard>
      <Container>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator size="large" />
            <MessageText>Searching...</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <PlantFeed searchScreen />
          </MessageContainer>
        ) : null}

        {data?.searchPlant !== undefined ? (
          data?.searchPlant?.plants?.length === 0 ? (
            <MessageContainer>
              <MessageText>Could not find anything.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              numColumns={numColumns}
              data={data?.searchPlant?.plants}
              keyExtractor={(photo) => "" + photo.id}
              renderItem={renderItem}
            />
          )
        ) : null}
      </Container>
    </DismissKeyboard>
  );
}
