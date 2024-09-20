const { getDB } = require("../config/config");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const USER_COLLECTION = "Users";
const POST_COLLECTION = "Posts";
const FOLLOW_COLLECTION = "Follows";

exports.getFollow = async () => {
  const db = await getDB();
  const result = await db.collection(FOLLOW_COLLECTION).find({}).toArray();

  return result;
};

exports.addFollow = async (data, userData) => {
  const db = await getDB();
  console.log(data);
  console.log(userData);
};
