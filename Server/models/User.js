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

  static async findById(id) {
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("User not found");
    }

    // console.log(await this.follower(_id), 'ini follower');

    return {
      ...user,
      _id: user._id.toString(),
      followers:  await this.follower(id),
      followings: await this.following(id),
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
      const followCollection = database.collection("follows");
  
      const result = await followCollection
        .aggregate([
          {
            $match: {
              followingId: new ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followerId",
              foreignField: "_id",
              as: "users",
            },
          },
          {
            $unwind: {
              path: "$users",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "users._id": 1,
              "users.name": 1,
              "users.username": 1,
              "users.email": 1,
            }
          },
        ])
        .toArray();
  
      // console.log(result, 'ini result follower');
      
      return result.map((item) => item.users) || [];
    } catch (error) {
      console.error("Follower not found:", error.message);
      throw new Error("Follower not found");
    }
  }
  
  static async following(userId) {
    try {
      const followCollection = database.collection("follows");
  
      const result = await followCollection
        .aggregate([
          {
            $match: {
              followerId: new ObjectId(userId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followingId",
              foreignField: "_id",
              as: "users",
            },
          },
          {
            $unwind: {
              path: "$users",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              "users._id": 1,
              "users.name": 1,
              "users.username": 1,
              "users.email": 1,
            }
          },
        ])
        .toArray();
  
      
      return result.map((item) => item.users) || [];
    } catch (error) {
      console.error("Following not found:", error.message);
      throw new Error("Following not found");
    }
  }
  
}

module.exports = User;
