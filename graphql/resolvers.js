const feedResolver = require("./resolvers/feedResolver");
const userResolver = require("./resolvers/userResolver");

const resolvers = {
  Query: {
    getPosts: feedResolver.getPosts,
    getPost: feedResolver.getPost,
  },
  Mutation: {
    addPost: feedResolver.addPost,
    deletePost: feedResolver.deletePost,
    updatePost: feedResolver.updatePost,
    signIn: userResolver.signIn,
    logIn: userResolver.logIn,
  },
};

module.exports = resolvers;
