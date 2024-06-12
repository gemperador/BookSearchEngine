const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const routes = require('./routes');
const { authMiddleware } = require('./auth');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Apply authentication middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const modifiedReq = authMiddleware({ req });
    return { user: modifiedReq.user };
  },
});

// Apply Apollo Server middleware
server.start().then(() => {
  server.applyMiddleware({ app });

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
});
