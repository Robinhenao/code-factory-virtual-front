import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: "https://codefact.udea.edu.co/modulo-13/graphql",
});

const publicRoutes = ['/authentication/login/login', '/authentication/registro/registro'];


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  
  const currentPath = window.location.pathname;
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  
  if (isPublicRoute) {
    return { headers };
  }

  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


const client = new ApolloClient({
  link:authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;