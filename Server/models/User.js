const { database } = require("../config/mongodb");
const { checkPassword } = require("../helpers/hashingpassword");
const { signToken } = require("../helpers/jwt");


class User {
  static async findAll() {
    const userscollection = database.collection("users");

    // Query for movies that have a runtime less than 15 minutes
    // const query = { runtime: { $lt: 15 } };
    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { name: 1, username: 1, username: 1 },
    };

    const users = await userscollection.find({}, options).toArray();
    // Print a message if no documents were found
    return users;
  }

  static async createUser({ name, username, email, password }) {
    const userscollection = database.collection("users");

    const newUser = {
      name,
      username,
      email,
      password,
    };
    const result = await userscollection.insertOne(newUser);

    console.log(result);

    return {
      ...newUser,
      _id: result.insertedId,
    };
  }

  static async login({ username, password }) {
    try {
      const userscollection = database.collection("users");

      const user = await userscollection.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = checkPassword(password, user.password);

      if (!isPasswordValid) {
        throw new Error("Invalid username/password");
      }

      const token = {
        accessToken: signToken({
          id: user._id,
          email: user.username,
        }),
      };

      if (!token) {
        throw new Error("Invalid token");
      }

      console.log("coba ini",token);
      

      return { user, token: token.accessToken };
    } catch (error) {
      throw new Error("Failed to Login");
    }
  }
}
module.exports = User;
