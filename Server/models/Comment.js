const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

module.exports = class Comment {
  static async findAll() {
    const commentsCollection = database.collection("comments");

    const options = {
      sort: { name: 1 },
      projection: { content: 1, username: 1 },
    };

    const comments = await commentsCollection.find({}, options).toArray();
    return comments;
  }


}