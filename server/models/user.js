require("dotenv").config();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/config");
const { hash, compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { GraphQLError } = require("graphql");
const USER_COLLECTION = process.env.USER_COLLECTION;
const FOLLOW_COLLECTION = process.env.FOLLOW_COLLECTION;

exports.getUser = async () => {
  const db = await getDB();
  const result = await db.collection(USER_COLLECTION).find({}).toArray();

  return result;
};

exports.getUserByEmail = async (username) => {
  const db = await getDB();
  const result = await db.collection(USER_COLLECTION).findOne(
    { username },
    {
      projection: {
        password: 0,
      },
    }
  );

  return result;
};

exports.addUser = async (data) => {
  const db = await getDB();

  const { name, username, email, password } = data;

  const findUser = await db.collection(USER_COLLECTION).findOne({ username });
  if (findUser) {
    throw new GraphQLError("Username already exist", {
      extensions: {
        http: "400",
        code: "BAD_REQUEST",
      },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new GraphQLError("Invalid email format", {
      extensions: {
        http: "400",
        code: "BAD_REQUEST",
      },
    });
  }

  if (password.length < 5) {
    throw new GraphQLError("Password must be at least 5 characters long", {
      extensions: {
        http: "400",
        code: "BAD_REQUEST",
      },
    });
  }

  const newUser = {
    name,
    username,
    email,
    password: hash(password),
  };

  const result = await db.collection(USER_COLLECTION).insertOne(newUser);

  const resultId = result["insertedId"];

  const query = {
    _id: resultId,
  };
  const recentlyAddedUser = await db.collection(USER_COLLECTION).findOne(query);

  return recentlyAddedUser;
};

exports.loginUser = async (data) => {
  const { username, password } = data;
  const db = await getDB();

  const user = await db.collection(USER_COLLECTION).findOne({ username });

  if (!compare(password, user.password)) throw Error;

  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
  }

  const token = signToken(payload);

  return {userData, token}
};

exports.searchUser = async (data) => {
  const { username } = data;
  const db = await getDB();

  const user = await db
    .collection(USER_COLLECTION)
    .find({ username: { $regex: username, $options: "i" } })
    .toArray();

  return user;
};

exports.getUserById = async (data) => {
  const _id = new ObjectId(data._id);
  const db = await getDB();

  const result = await db
    .collection(USER_COLLECTION)
    .aggregate([
      {
        $lookup: {
          from: FOLLOW_COLLECTION,
          localField: "_id", 
          foreignField: "followerId", 
          as: "following", 
        },
      },
      {
        $match: {
          _id,
        },
      },
      {
        $lookup: {
          from: FOLLOW_COLLECTION,
          localField: "_id", 
          foreignField: "followingId", 
          as: "followers", 
        },
      },
      {
        $project: {
          password: 0
        }
      }
    ])
    .next();

    return result
};
