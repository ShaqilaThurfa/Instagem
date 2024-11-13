const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

module.exports = class Post {
  static async findAll() {
    const postsCollection = database.collection("posts");

    const options = {
      sort: { createdAt: -1 },
      projection: { content: 1, imgUrl: 1, authorId: 1, tags: 1, createdAt: 1, updatedAt: 1, comments: 1, likes: 1 },
    };

    const posts = await postsCollection.find({}, options).toArray();
    return posts;
  }

  static async findById(id) {
    const postsCollection = database.collection("posts");

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      throw new Error("Post not found");
    }
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
      comments: [],
      likes: [],
    };

    const result = await postsCollection.insertOne(newPost);

    return {
      ...newPost,
      _id: result.insertedId,
    };
  }

  static async addComment(postId, { content, username }) {
    const postsCollection = database.collection("posts");
    const timestamp = new Date().toISOString();

    const updatedPost = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          comments: {
            content,
            username,
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        },
      }
    );

    if (updatedPost.modifiedCount === 0) {
      throw new Error("Failed to add comment");
    }

    return this.findById(postId);
  }
};
