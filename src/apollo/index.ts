import { ApolloClient, InMemoryCache } from "@apollo/client";

export const getApolloClient = async () => {
  // This will only point to prod in the electron program, and not in the web.
  const isProd = await window.environment?.isProd();

  const uri = isProd
    ? "https://qs-buddy-server.herokuapp.com/graphql"
    : "http://localhost:4000/graphql";

  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
};
