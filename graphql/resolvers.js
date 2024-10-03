const feedResolver = require("./resolvers/feedResolver");
const userResolver = require("./resolvers/userResolver");

const resolvers = {
  Query: {
    ...feedResolver.Query,
  },
  Mutation: {
    ...feedResolver.Mutation,
    ...userResolver.Mutation,
  },
};

module.exports = resolvers;
