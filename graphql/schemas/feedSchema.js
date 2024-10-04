const { default: gql } = require("graphql-tag");

// prettier-ignore
const postSchema = gql`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  interface Response {
    code: Int!
    success: Boolean!
    message: String!
  }

  type Query_And_MutationResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
  }

  type GetPosts_QueryResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
    posts: [Post!]
    totalItems: Int!
  }

  type GetPost_QueryResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
    post: Post!
  }

  type Add_Update_Post_MutationResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
    post: Post!
  }

  type Query {
    getPosts(page: Int!): GetPosts_QueryResponse!
    getPost(postId: ID!): GetPost_QueryResponse!
  }

  type Mutation {
    addPost(title: String!, content: String!, imageUrl: String!): Add_Update_Post_MutationResponse!
    deletePost(postId: ID!): Query_And_MutationResponse!
    updatePost(postId: ID!, title: String!, content: String!, imageUrl: String!): Add_Update_Post_MutationResponse!
  }
`;

module.exports = postSchema;
