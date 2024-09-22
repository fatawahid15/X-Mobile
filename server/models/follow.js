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

exports.follower = async (data) => {
  const _id = new ObjectId(data._id); // The user being followed
  const db = await getDB();

  const result = await db
  .collection(FOLLOW_COLLECTION)
  .aggregate([
    {
      $match: {
        followerId: _id, // Match documents where the user is following others
      },
    },
    {
      $lookup: {
        from: USER_COLLECTION, 
        localField: "followingId", // Use followingId to find the user being followed
        foreignField: "_id", // Match the user's _id in USER_COLLECTION
        as: "User", // The resulting data will be in the "User" field (an array)
      },
    },
    {
      $unwind: "$User", // Flatten the "User" array to extract individual users
    },
    {
      $project: {
        _id: 0, // Exclude the follow relationship _id
        followerId: 1, // Include the follower's ID
        "User._id": 1, // Include the user ID from the joined User document
        "User.name": 1, // Include the user's name
        "User.username": 1, // Include the user's username
      },
    },
  ])
  .toArray();

  console.log(result);

return result; // Returns an array of following user data

};


exports.following = async (data) => {
  const _id = new ObjectId(data._id);
  const db = await getDB();

  const result = await db
  .collection(FOLLOW_COLLECTION)
  .aggregate([
    {
      $match: {
        followingId: _id, // Match documents where the user is following others
      },
    },
    {
      $lookup: {
        from: USER_COLLECTION, 
        localField: "followerId", // Use followingId to find the user being followed
        foreignField: "_id", // Match the user's _id in USER_COLLECTION
        as: "User", // The resulting data will be in the "User" field (an array)
      },
    },
    {
      $unwind: "$User", // Flatten the "User" array to extract individual users
    },
    {
      $project: {
        _id: 0, // Exclude the follow relationship _id
        followerId: 1, // Include the follower's ID
        "User._id": 1, // Include the user ID from the joined User document
        "User.name": 1, // Include the user's name
        "User.username": 1, // Include the user's username
      },
    },
  ])
  .toArray();

  console.log(result);

return result; // Returns an array of following user data

};
