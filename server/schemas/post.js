const redis = require("../config/redis");
const { getPost, getSpecPost, addPost, addComment, addLike } = require("../models/posts");

const postTypeDef = `#graphql
interface Post {
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
}

type PostResponse implements Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    User: UserOwnResponse
}

type UserOwnResponse {
  _id: ID
  name: String
  username: String
  email: String
}

type Query {
    posts: PostMongoResponse
    specPost(_id: ID!): PostMongoOneResponse
}

type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
}

input CommentInput {
    content: String
}

type Like {
    username: String
    createdAt: String
}

input LikeInput {
    userId: ID
}

type Mutation {
    addPost(content: String!, tags: [String], imgUrl: String): PostMongoOneResponse   
    addComment(content: String!, postId: ID!): PostMongoOneResponse
    addLike(postId: ID!): PostMongoOneResponse
}
`;

const PostResolver = {
  Query: {
    posts: async (_, __, contextValue) => {
      await contextValue.authentication();

      const postCache = await redis.get('posts')
      const result = await getPost();

      if(postCache){
        return {
          statusCode: 200,
          message: "success getting post",
          data: JSON.parse(postCache),
        }
      }

     await redis.set('posts', JSON.stringify(result))

      return {
        statusCode: 200,
        message: "success getting post",
        data: result,
      };
    },
    specPost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();

      const result = await getSpecPost(args);

      return {
        statusCode: 200,
        message: "Success getting specific post",
        data: result,
      };
    },
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const user = await contextValue.authentication();

      await redis.del('posts')

      const result = await addPost(args, user)

      return {
        statusCode: 200,
        message: "Success getting specific post",
        data: result,
      };
    },
    addComment: async (_, args, contextValue) => {
      const user = await contextValue.authentication()

      const result = await addComment(args, user)

      return {
        statusCode: 200,
        message: "Success getting specific post",
        data: result,
      };
    },
    addLike: async (_, args, contextValue) => {
      const user = await contextValue.authentication()
      const result = addLike(args, user)

      return {
        statusCode: 200,
        message: "Success getting specific post",
        data: result,
      };
    }
  },
};

module.exports = { postTypeDef, PostResolver };
