
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import * as SecureStore from 'expo-secure-store';

const httpLink = new HttpLink({ uri: "https://instagem.shaqilathurfa.online/" }); 

const authLink = new ApolloLink(async (operation, forward) => {
 
  const token = await SecureStore.getItemAsync("accessToken");

  operation.setContext({
    headers: {
      Authorization: token ? token : "",
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
