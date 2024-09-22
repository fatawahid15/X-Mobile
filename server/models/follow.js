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

  const findUser = await db.collection(USER_COLLECTION).findOne({ _id: userId });
  if (!findUser) {
    throw new GraphQLError("User does not exist", {
      extensions: {
        http: "404",
        code: "NOT_FOUND",
      },
    });
  }

 
  const checkFollow = await db
    .collection(FOLLOW_COLLECTION)
    .findOne({ followingId: userId, followerId: currentUserId });

  if (!checkFollow) {
    throw new GraphQLError("Not following this user", {
      extensions: {
        http: "400",
        code: "BAD_REQUEST",
      },
    });
  }

  await db
    .collection(FOLLOW_COLLECTION)
    .deleteOne({ followingId: userId, followerId: currentUserId });

  const message = "Successfully unfollowed user";

  return message;
};


exports.follower = async (data) => {
  const _id = new ObjectId(data._id);
  const db = await getDB();

  const result = await db
  .collection(FOLLOW_COLLECTION)
  .aggregate([
    {
      $match: {
        followerId: _id, 
      },
    },
    {
      $lookup: {
        from: USER_COLLECTION, 
        localField: "followingId",
        foreignField: "_id", 
        as: "User", 
      },
    },
    {
      $unwind: "$User", 
    },
    {
      $project: {
        _id: 0,
        followerId: 1,
        "User._id": 1, 
        "User.name": 1,
        "User.username": 1, 
      },
    },
  ])
  .toArray();

  console.log(result);

return result; 

};


exports.following = async (data) => {
  const _id = new ObjectId(data._id);
  const db = await getDB();

  const result = await db
  .collection(FOLLOW_COLLECTION)
  .aggregate([
    {
      $match: {
        followingId: _id, 
      },
    },
    {
      $lookup: {
        from: USER_COLLECTION, 
        localField: "followerId", 
        foreignField: "_id",
        as: "User", 
      },
    },
    {
      $unwind: "$User", 
    },
    {
      $project: {
        _id: 0,
        followerId: 1,
        "User._id": 1,
        "User.name": 1,
        "User.username": 1,
      },
    },
  ])
  .toArray();

  console.log(result);

return result; 

};
