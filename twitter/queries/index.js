import { gql } from "@apollo/client";

export const GET_LOGIN = gql`
  mutation UserLogin($username: String!, $password: String!) {
    userLogin(username: $username, password: $password) {
      statusCode
      message
      error
      token
      user {
        _id
        name
        username
        email
      }
    }
  }
`;

export const GET_REGISTER = gql`
mutation AddUser($username: String!, $email: String!, $password: String!, $name: String) {
  addUser(username: $username, email: $email, password: $password, name: $name) {
    statusCode
    message
    error
    data {
      _id
      name
      username
      email
    }
  }
}`

export const ADD_LIKE = gql`
mutation AddLike($postId: ID!) {
  addLike(postId: $postId) {
    statusCode
    message
    error
    data {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
      }
      createdAt
      updatedAt
      User {
        _id
        name
        username
        email
      }
    }
  }
}`

export const ADD_COMMENT = gql`
mutation AddComment($content: String!, $postId: ID!) {
  addComment(content: $content, postId: $postId) {
    statusCode
    message
    error
    data {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
      }
      createdAt
      updatedAt
      User {
        _id
        name
        username
        email
      }
    }
  }
}`

export const GET_SPEC_POST = gql`
query SpecPost($id: ID!) {
  specPost(_id: $id) {
    statusCode
    message
    error
    data {
      _id
      content
      imgUrl
      authorId
      createdAt
      updatedAt
      tags
      User {
        _id
        name
        username
        email
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
      }
    }
  }
}`

export const GET_POST = gql`
  query Posts {
    posts {
      statusCode
      message
      error
      data {
        _id
        content
        tags
        imgUrl
        authorId
        comments {
          content
          username
          createdAt
          updatedAt
        }
        likes {
          username
          createdAt
        }
        createdAt
        updatedAt
        User {
          _id
          name
          username
          email
        }
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query UserById($id: ID!) {
    userById(_id: $id) {
      statusCode
      message
      error
      data {
        _id
        name
        username
        email
        following {
          _id
          followingId
          followerId
          createdAt
          updatedAt
        }
        followers {
          _id
          followingId
          followerId
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const SEARCH_USER = gql`
  query UserSearch($username: String) {
    userSearch(username: $username) {
      statusCode
      message
      error
      data {
        _id
        name
        username
        email
      }
    }
  }
`;

export const GET_FOLLOWER = gql`
  query Follower($id: ID!) {
    follower(_id: $id) {
      statusCode
      message
      error
      data {
        _id
        User {
          _id
          name
          username
          email
        }
      }
    }
  }
`;

export const GET_FOLLOWING = gql`
  query Following($id: ID!) {
    following(_id: $id) {
      statusCode
      message
      error
      data {
        _id
        User {
          _id
          name
          username
          email
        }
      }
    }
  }
`;

export const ADD_FOLLOW = gql`
  mutation AddFollow($userId: ID!) {
    addFollow(userId: $userId) {
      error
      message
      statusCode
    }
  }
`;

export const REMOVE_FOLLOW = gql`
  mutation RemoveFollow($userId: ID!) {
    removeFollow(userId: $userId) {
      statusCode
      message
      error
    }
  }
`;

export const ADD_POST = gql`
mutation AddPost($content: String!, $tags: [String], $imgUrl: String) {
  addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
    statusCode
    message
    error
    data {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
      }
      createdAt
      updatedAt
      User {
        _id
        name
        username
        email
      }
    }
  }
}`
