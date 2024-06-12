// src/App.jsx
// Create an Apollo Provider to make every request work with the Apollo server.
import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ApolloProvider } from '@apollo/client';
import client from './utils/apolloClient';

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;

