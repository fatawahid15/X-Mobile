require("dotenv").config();
const { getDB } = require("../config/config");
const { ObjectId } = require("mongodb");
const { GraphQLError } = require("graphql");
const USER_COLLECTION = process.env.USER_COLLECTION;
const POST_COLLECTION = process.env.POST_COLLECTION;

exports.getPost = async () => {
  const db = await getDB();
  const result = await db
    .collection(POST_COLLECTION)
    .aggregate([
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: "authorId",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          tags: 1,
          imgUrl: 1,
          authorId: 1,
          comments: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          User: { $first: "$User" },
        },
      },
    ])
    .toArray();

  return result;
};

exports.getSpecPost = async (data) => {
  const db = await getDB();
  const _id = new ObjectId(data._id);

  const result = await db
    .collection(POST_COLLECTION)
    .aggregate([
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: "authorId",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $match: {
          _id,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          tags: 1,
          imgUrl: 1,
          authorId: 1,
          comments: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          User: { $first: "$User" },
        },
      },
    ])
    .next();

  console.log(result);

  return result;
};

exports.addPost = async (data, userData) => {
  const db = await getDB();
  const { content, tags, imgUrl } = data;

  const authorId = userData.user._id;

  const addedData = {
    content,
    tags,
    imgUrl,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    likes: [],
  };

  const result = await db.collection(POST_COLLECTION).insertOne(addedData);

  const resultId = result["insertedId"];

  const query = {
    _id: resultId,
  };

  const recentlyAddedPost = await db.collection(POST_COLLECTION).findOne(query);

  return recentlyAddedPost;
};

exports.addComment = async (data, userData) => {
  const db = await getDB();
  const { content } = data;

  const postId = new ObjectId(data.postId);

  const newComment = {
    content,
    username: userData.user.username,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection(POST_COLLECTION).updateOne(
    { _id: postId },
    {
      $push: { comments: newComment },
      $set: { updatedAt: new Date() },
    }
  );

  const resultPost = await db
    .collection(POST_COLLECTION)
    .aggregate([
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: "authorId",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $match: {
          _id: postId,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          tags: 1,
          imgUrl: 1,
          authorId: 1,
          comments: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          User: { $first: "$User" },
        },
      },
    ])
    .next();

  console.log(resultPost);

  return resultPost;
};

exports.addLike = async (data, userData) => {
  const db = await getDB();
  const postId = new ObjectId(data.postId);

  const checkLike = await db.collection(POST_COLLECTION).findOne({
    _id: postId,
    likes: { $elemMatch: { username: userData.user.username } },
  });

  if (checkLike) {
    throw new GraphQLError("Like already exist", {
      extensions: {
        http: "400",
        code: "EXIST",
      },
    });
  }

  const newLike = {
    username: userData.user.username,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection(POST_COLLECTION).updateOne(
    { _id: postId },
    {
      $push: { likes: newLike },
      $set: { updatedAt: new Date() },
    }
  );

  const result = await db
    .collection(POST_COLLECTION)
    .aggregate([
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: "authorId",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $match: {
          _id: postId,
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          tags: 1,
          imgUrl: 1,
          authorId: 1,
          comments: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          User: { $first: "$User" },
        },
      },
    ])
    .next();

  return result;
};
