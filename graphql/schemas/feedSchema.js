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

  type getPostsQueryResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
    posts: [Post!]
    totalItems: Int!
  }

  type getPostQueryResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
    post: Post
  }

  type AddPostMutationResponse implements Response {
    code: Int!
    success: Boolean!
    message: String!
    post: Post
  }

  type Query {
    getPosts(page: Int!): getPostsQueryResponse!
    getPost(postId: ID!): getPostQueryResponse!
  }

  type Mutation {
    addPost(title: String!, content: String!, imageUrl: String!, creator: ID!): AddPostMutationResponse!
  }
`;

module.exports = postSchema;
