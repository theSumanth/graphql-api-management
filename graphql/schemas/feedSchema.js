const { default: gql } = require("graphql-tag");

// prettier-ignore
const postSchema = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  interface MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
  }

  type AddPostMutationResponse implements MutationResponse {
    code: Int!
    success: Boolean!
    message: String!
    post: Post!
  }

  type Query {
    getPosts(page: Int!): [Post!]!
    getPost(id: ID!): Post!
  }


  type Mutation {
    addPost(title: String!, content: String!, imageUrl: String!, creator: ID!): AddPostMutationResponse
  }
`;

module.exports = postSchema;
