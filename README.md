# Node.js-GraphQL Application

A Node.js backend with GraphQL for a blogging platform, featuring authentication, CRUD operations, custom validation, and error handling.

## Features

- **Authentication**: Middleware to ensure the user is authenticated before performing specific actions.
- **CRUD Operations**: Users can create, retrieve, update, and delete blog posts.
- **GraphQL API**: Uses GraphQL with Apollo Server to define and query data.
- **Custom Error Handling**: Centralized error handling using a custom error class.
- **Validation**: Custom validation using Joi to validate incoming data.

## Technologies Used

- **Node.js** - Backend runtime environment
- **Express** - Web framework for Node.js
- **GraphQL** - Query language for APIs
- **Apollo Server** - GraphQL server for handling requests
- **Joi** - Data validation library
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)** - For authentication and authorization
- **Bcrypt** - Library to hash passwords

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) v20.17.0 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) - locally installed or a MongoDB Atlas account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/theSumanth/graphql-api-management.git
   cd graphql-api-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server
   ```bash
   npm start
   ```

# GraphQL API Usage

## User Queries & Mutations

### 1. Mutation: Sign Up User

```graphql
mutation {
  signIn(email: "user@example.com", password: "password123", name: "John Doe") {
    code
    success
    message
    user {
      email
      name
      createdAt
    }
  }
}
```

### 2. Mutation: Log In User

```graphql
mutation {
  logIn(email: "user@example.com", password: "password123") {
    code
    success
    message
    token
    user {
      email
      name
    }
  }
}
```

## Post Queries & Mutations

### 1. Query: Get Posts (Paginated)

```graphql
query {
  getPosts(page: 1) {
    code
    success
    message
    totalItems
    posts {
      _id
      title
      content
      creator {
        name
      }
      createdAt
    }
  }
}
```

### 2. Query: Get a Single Post

```graphql
query {
  getPost(postId: "POST_ID") {
    code
    success
    message
    post {
      _id
      title
      content
      creator {
        name
      }
      createdAt
    }
  }
}
```

### 3. Mutation: Add a Post

```graphql
mutation {
  addPost(
    title: "New Post"
    content: "This is the content of the new post"
    imageUrl: "https://example.com/image.jpg"
  ) {
    code
    success
    message
    post {
      _id
      title
      content
      creator {
        name
      }
      createdAt
    }
  }
}
```

### 4. Mutation: Update a Post

```graphql
mutation {
  updatePost(
    postId: "POST_ID"
    title: "Updated Title"
    content: "Updated content"
    imageUrl: "https://example.com/new-image.jpg"
  ) {
    code
    success
    message
    post {
      _id
      title
      content
      creator {
        name
      }
      updatedAt
    }
  }
}
```

### 5. Mutation: Delete a Post

```graphql
mutation {
  deletePost(postId: "POST_ID") {
    code
    success
    message
  }
}
```
