require("dotenv").config();
const { getDB } = require("../config/config");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const USER_COLLECTION = process.env.USER_COLLECTION;
const FOLLOW_COLLECTION = process.env.FOLLOW_COLLECTION;

exports.getFollow = async () => {
  const db = await getDB();
  const result = await db.collection(FOLLOW_COLLECTION).find({}).toArray();

  return result;
};

exports.addFollow = async (data, userData) => {
  const db = await getDB();

  const userId = new ObjectId(data.userId);

  const currentUserId = new ObjectId(userData.user._id);

  const findUser = await db
    .collection(USER_COLLECTION)
    .findOne({ _id: userId });

  if (!findUser) {
    throw new GraphQLError("User Not exist", {
      extensions: {
        http: "404",
        code: "NOT FOUND",
      },
    });
  }

  const checkFollow = await db
    .collection(FOLLOW_COLLECTION)
    .findOne({ followingId: userId, followerId: currentUserId });

  console.log(checkFollow);

  if (checkFollow) {
    throw new GraphQLError("Already followed", {
      extensions: {
        http: "404",
        code: "NOT FOUND",
      },
    });
  }

  const newFollow = {
    followingId: userId,
    followerId: currentUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection(FOLLOW_COLLECTION).insertOne(newFollow);

  const message = "Success following user";

  return message;
};

exports.removeFollow = async (data, userData) => {
  const db = await getDB();

  const userId = new ObjectId(data.userId);

  const currentUserId = new ObjectId(userData.user._id);

  const findUser = await db
    .collection(USER_COLLECTION)
    .findOne({ _id: userId });

  if (!findUser) {
    throw new GraphQLError("User Not exist", {
      extensions: {
        http: "404",
        code: "NOT FOUND",
      },
    });
  }

  const checkFollow = await db
    .collection(FOLLOW_COLLECTION)
    .findOne({ followingId: userId, followerId: currentUserId });

  console.log(checkFollow);

  if (checkFollow) {
    throw new GraphQLError("Already followed", {
      extensions: {
        http: "404",
        code: "NOT FOUND",
      },
    });
  }

  const newFollow = {
    followingId: userId,
    followerId: currentUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection(FOLLOW_COLLECTION).deleteOne(newFollow);

  const message = "Success unfollow user";

  return message;
};
