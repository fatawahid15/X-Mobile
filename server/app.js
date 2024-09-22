require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const { responseTypeDefs } = require("./schemas/response");
const { connect } = require("./config/config");
const { userTypeDef, UserResolver } = require("./schemas/user");
const { postTypeDef, PostResolver } = require("./schemas/post");
const { getUserByEmail } = require("./models/user");
const { verify } = require("./helpers/jwt");
const { followTypeDef, FollowResolver } = require("./schemas/follow");

const server = new ApolloServer({
  typeDefs: [userTypeDef, responseTypeDefs, postTypeDef, followTypeDef],
  resolvers: [UserResolver, PostResolver, FollowResolver],
  introspection: true,
});

(async () => {
  await connect();

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT },
    context: async ({ req, res }) => {
      return {
        authentication: async () => {
          const { authorization } = req.headers;

          if (!authorization) {
            throw new GraphQLError("You are not authorized", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }
          const token = authorization.split(" ")[1];

          if (!token) {
            throw new GraphQLError("You are not authenticated", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }

          const currentUser = verify(token);

          if (!currentUser) {
            throw new GraphQLError("You are not authenticated", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }

          const user = await getUserByEmail(currentUser.username);

          if (!user) {
            throw new GraphQLError("You are not authenticated", {
              extensions: {
                http: "401",
                code: "UNAUTHENTICATED",
              },
            });
          }

          return {
            user,
          };
        },
      };
    },
  });

  console.log(`Server ready at ${url}`);
})();
