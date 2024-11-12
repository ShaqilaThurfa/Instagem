const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

module.exports = class Post {
  static async findAll() {
    const postsCollection = database.collection("posts");

    const options = {
      sort: { name: 1 },
      projection: { content: 1, username: 1 },
    };

    const posts = await postsCollection.find({}, options).toArray();
    return posts;
  }

  static async findPost(id) {
    const postsCollection = database.collection("posts");

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    return post;
  }

  static async createPost(content, imgUrl, authorId, tags) {
    const postsCollection = database.collection("posts");

    const timestamp = new Date();
    const newPost = {
      content,
      imgUrl,
      authorId,
      tags,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const result = await postsCollection.insertOne(newPost);

    console.log(result)
    
    return {
      ...newPost, 
      _id: result.insertedId, 
    };
  }

  // static async updatePost(postId, updatedPost) {
  //   const postsCollection = database.collection("posts");

  //   const result = await postsCollection.updateOne(
  //     { _id: new ObjectId(postId) },
  //     { $set: updatedPost }
  //   );

  //   return result;
  // }

  static async deletePost(postId) {
    const postsCollection = database.collection("posts");

    const result = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    return result;
  }
};
