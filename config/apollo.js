const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const typeDefs = require("../graphql/schema");
const resolvers = require("../graphql/resolvers");
const { errorHandler } = require("../util/error");

const createApolloServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: errorHandler,
    context: async ({ req }) => {
      return { req };
    },
  });

  await server.start();
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );
};

module.exports = createApolloServer;
