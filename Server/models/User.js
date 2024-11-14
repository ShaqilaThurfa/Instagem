const { database } = require("../config/mongodb");
const { checkPassword } = require("../helpers/hashingpassword");
const { signToken } = require("../helpers/jwt");
const { ObjectId } = require("mongodb");

class User {
  static async findAll() {
    const usersCollection = database.collection("users");

    const options = {
      sort: { name: 1 },
      projection: { name: 1, username: 1, email: 1 },
    };

    const users = await usersCollection.find({}, options).toArray();

    return users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));
  }

  static async createUser({ name, username, email, password }) {
    const usersCollection = database.collection("users");

    const newUser = {
      name,
      username,
      email,
      password,
    };

    try {
      const result = await usersCollection.insertOne(newUser);
      return {
        ...newUser,
        _id: result.insertedId.toString(),
      };
    } catch (error) {
      console.error("Failed to create user:", error.message);
      throw new Error("User creation failed");
    }
  }

  static async login({ username, password }) {
    try {
      const usersCollection = database.collection("users");

      const user = await usersCollection.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = checkPassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid username/password");
      }

      const token = signToken({
        id: user._id.toString(),
        username: user.username,
      });

      return { user, token };
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error("Failed to Login");
    }
  }

  static async findById(_id) {
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(_id) });
    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user,
      _id: user._id.toString(),
    };
  }

  static async search(query) {
    try {
      const usersCollection = database.collection("users");
      const regex = new RegExp(query, "i");

      const users = await usersCollection
        .find({
          $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
        })
        .toArray();

      return users.map((user) => ({
        ...user,
        _id: user._id.toString(),
      }));
    } catch (error) {
      console.error("Search error:", error.message);
      throw new Error("User not found");
    }
  }

  static async follower(userId) {
    try {
      const followCollection = database.collection("users");

      const result = await followCollection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followers",
            },
          },
        ])
        .toArray();

      console.log(result[0], 'ini follower');

      return result[0];
    } catch (error) {
      throw new Error("Follower not found");
    }
  }

  static async following(userId) {
    try {
      const followCollection = database.collection("users");

      const result = await followCollection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "following",
            },
          },
        ])
        .toArray();

      console.log(result[0], 'ini following');

      return result[0];
    } catch (error) {
      throw new Error("Following not found");
    }
  }
}

module.exports = User;
