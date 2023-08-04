import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client';

// Construct GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// middleware function to retrieve token from localStorage and set the request headers before making the GraphQL API request
const authLink = setContext((_, { headers }) => {
  // retrieve token from localStorage
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // add token to the headers
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// instantiate Apollo Client
const client = new ApolloClient({
  // set up our request execution pipeline to include the authLink middleware function
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={<SavedBooks />} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
