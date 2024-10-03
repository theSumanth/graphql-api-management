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

  type SignInUserMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: User
  }
  
  type LogInUserMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type Mutation {
    signIn(email: String!, password: String!, name: String!): SignInUserMutationResponse
    logIn(email: String!, password: String!): LogInUserMutationResponse
  }
`;

module.exports = userSchema;
