const {
  getUser,
  getUserByEmail,
  addUser,
  loginUser,
  searchUser,
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

type Query {
  users: UserMongoResponse
  userByEmail(email: String!): UserSpecResponse
  userSearch(username: String): UserMongoResponse
}

type Mutation {
  addUser(name: String, username: String!, email: String!, password: String!): UserRegisterResponse
  userLogin(username: String!, password: String!): UserLoginResponse
}
`;

const UserResolver = {
  Query: {
    users: async () => {
      const user = await getUser();
      return {
        statusCode: 200,
        message: "success getting user",
        data: user,
      };
    },

    userSearch: async (_, args) => {
      const result = await searchUser(args);

      return {
        statusCode: 200,
        message: "success getting user",
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

      return {
        statusCode: "200",
        message: "Success Login!",
        token: result,
      };
    },
  },
};

module.exports = { userTypeDef, UserResolver };
