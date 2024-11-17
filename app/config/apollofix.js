import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: 'https://22e6-2a09-bac5-3a22-88c-00-da-6e.ngrok-free.app',
});

const authLink = setContext( async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat([authLink, httpLink]),
  cache: new InMemoryCache()
});