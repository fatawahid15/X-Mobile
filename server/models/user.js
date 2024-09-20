require("dotenv").config();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/config");
const { hash, compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { GraphQLError } = require("graphql");
const USER_COLLECTION = process.env.USER_COLLECTION;

exports.getUser = async () => {
  const db = await getDB();
  const result = await db.collection(USER_COLLECTION).find({}).toArray();

  return result;
};

exports.getUserByEmail = async (email) => {
  const db = await getDB();
  const result = await db.collection(USER_COLLECTION).findOne(
    { email },
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
    throw new GraphQLError("Invalid username/password", {
      extensions: {
        http: "401",
        code: "UNAUTHENTICATED",
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

  const token = signToken(payload);

  return token;
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
