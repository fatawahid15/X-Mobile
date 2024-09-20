const { getFollow, addFollow } = require("../models/follow");

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

type Query {
    follow: FollowMongoResponse
}

type Mutation {
    addFollow(userId: ID!): FollowMutation
    removeFollow(userId: ID!): FollowMutation
}
`;

const FollowResolver = {
  Query: {
    follow: async () => {
      const result = await getFollow();

      return {
        statusCode: 200,
        message: "Success getting all follow data",
        data: result,
      };
    },
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
