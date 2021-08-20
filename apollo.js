import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";

// OFFICE : 172.30.1.37:4000/graphql
// AZURE :  https://hwamoak-backend.azurewebsites.net/graphql
// HEROKU :  https://hwamoak-backend.herokuapp.com/graphql

export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

const TOKEN = "token";

export const logUserIn = async (token) => {
  await AsyncStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
  tokenVar(token);
};

export const logUserOut = async () => {
  await AsyncStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  tokenVar(null);
};

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

// uri: "http://localhost:4000/graphql",
// uri: "https://hwamoak-backend.herokuapp.com/graphql",

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
});

const httpLinks = authLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLinks,
  cache,
});

export default client;
