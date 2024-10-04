const { default: gql } = require("graphql-tag");

// prettier-ignore
const userSchema = gql`
  type User {
    email: String!
    name: String!
    posts: [Post!]
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  interface MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type SignInUser_MutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: User!
  }
  
  type LogInUser_MutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    token: String!
    user: User!
  }

  type Mutation {
    signIn(email: String!, password: String!, name: String!): SignInUser_MutationResponse
    logIn(email: String!, password: String!): LogInUser_MutationResponse
  }
`;

module.exports = userSchema;
