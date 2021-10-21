import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	makeVar,
	split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import {
	getMainDefinition,
	offsetLimitPagination,
} from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";

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
	isLoggedInVar(false);
	tokenVar("");
	await AsyncStorage.removeItem(TOKEN);
};

const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			token: tokenVar(),
		},
	};
});

// uri: "https://hwamoak-backend.herokuapp.com/graphql",
// uri: "http://localhost:4000/graphql",

const uploadHttpLink = createUploadLink({
	uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
	uri: "ws://localhost:4000/graphql",
	options: {
		reconnect: true,
		connectionParams: () => ({
			token: tokenVar(),
		}),
	},
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		console.log(`GraphQL Error`, graphQLErrors);
	}
	if (networkError) {
		console.log("Network Error", networkError);
	}
});

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				seeFeed: offsetLimitPagination(["username"]),
				seeWholePlantsFeed: offsetLimitPagination(),
				seeComments: offsetLimitPagination(["id"]),
			},
		},
	},
});

const httpLinks = authLink.concat(onErrorLink).concat(uploadHttpLink);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	httpLinks
);

const client = new ApolloClient({
	link: splitLink,
	cache,
});

export default client;
