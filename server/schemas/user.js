const {
  getUser,
  getUserByEmail,
  addUser,
  loginUser,
  searchUser,
  getUserById,
} = require("../models/user");

const userTypeDef = `#graphql
interface User {
  name: String
  username: String
  email: String
  password: String
}

type UserInput {
  name: String
  username: String
  email: String
  password: String
}

type UserResponse {
  _id: ID
  name: String
  username: String
  email: String
}

type UserIdResponse {
  _id: ID
  name: String
  username: String
  email: String
  following: [FollowResponse]
  followers: [FollowResponse]
}

type Query {
  users: UserMongoResponse
  userByEmail(email: String!): UserSpecResponse
  userSearch(username: String): UserMongoResponse
  userById(_id: ID!): UserOneResponse
}

type Mutation {
  addUser(name: String, username: String!, email: String!, password: String!): UserRegisterResponse
  userLogin(username: String!, password: String!): UserLoginResponse
}
`;

const UserResolver = {
  Query: {
    users: async (_, __, contextValue) => {
      await contextValue.authentication();
      const user = await getUser();
      return {
        statusCode: 200,
        message: "success getting user",
        data: user,
      };
    },

    userSearch: async (_, args, contextValue) => {
      await contextValue.authentication();
      const result = await searchUser(args);

      return {
        statusCode: 200,
        message: "success getting user",
        data: result,
      };
    },

    userById: async (_, args, contextValue) => {
      await contextValue.authentication();
      const result = await getUserById(args);

      console.log(result);

      return {
        statusCode: 200,
        message: "Success getting specified user",
        data: result,
      };
    },

    userByEmail: async (_, args, contextValue) => {
      await contextValue.authentication();

      const { email } = args;

      const user = await getUserByEmail(email);

      return {
        statusCode: 200,
        message: "success getting specific user",
        user,
      };
    },
  },
  Mutation: {
    addUser: async (_, args) => {
      const result = await addUser(args);

      return {
        statusCode: 200,
        message: "success create new user",
        data: result,
      };
    },
    userLogin: async (_, args) => {
      const result = await loginUser(args);

      console.log(result);

      return {
        statusCode: "200",
        message: "Success Login!",
        token: result.token,
        user: result.userData
      };
    },
  },
};

module.exports = { userTypeDef, UserResolver };
