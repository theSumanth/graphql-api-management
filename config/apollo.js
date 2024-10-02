const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const typeDefs = require("../graphql/schema");
const resolvers = require("../graphql/resolvers");

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server));
};

module.exports = createApolloServer;
