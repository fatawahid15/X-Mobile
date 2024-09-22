const { getFollow, addFollow, follower, following } = require("../models/follow");

const followTypeDef = `#graphql
interface Follow {
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
}

type FollowResponse implements Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
}

type FollowerFollowing {
  _id: ID
  User: UserResponse
}

type UserResponse {
  _id: ID
  name: String
  username: String
}

type Query {
    follow: FollowMongoResponse
    follower(_id: ID!): FollowListResponse
    following(_id: ID!): FollowListResponse
}

type Mutation {
    addFollow(userId: ID!): FollowMutation
    removeFollow(userId: ID!): FollowMutation
}
`;

const FollowResolver = {
  Query: {
    follow: async (_, __, contextValue) => {
      await contextValue.authentication();
      const result = await getFollow();

      return {
        statusCode: 200,
        message: "Success getting all follow data",
        data: result,
      };
    },
    follower: async (_, args, contextValue) => {
      await contextValue.authentication()
      const result = await follower(args)
      return {
        statusCode: 200,
        message: "Success getting all follow data",
        data: result,
      }
    },
    following: async (_, args, contextValue) => {
      await contextValue.authentication()
      const result = await following(args)

      console.log(result);

      return {
        statusCode: 200,
        message: "Success getting all follow data",
        data: result,
      }
    }
  },
  Mutation: {
    addFollow: async (_, args, contextValue) => {
      const user = await contextValue.authentication();
      const result = await addFollow(args, user);

      return {
        statusCode: 201,
        message: result,
      };
    },
    removeFollow: async (_, args, contextValue) => {
      const user = await contextValue.authentication();
      const result = await addFollow(args, user);

      return {
        statusCode: 201,
        message: result,
      };
    },
  },
};

module.exports = { followTypeDef, FollowResolver };
