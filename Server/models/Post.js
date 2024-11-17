const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

module.exports = class Post {
  static async findAll() {
    const postsCollection = database.collection("posts");

    const posts = await postsCollection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "authorDetails",
          },
        },
        {
          $unwind: "$authorDetails",
        },
        {
          $sort: { createdAt: -1 }, // Perbaikan di sini
        },
      ])
      .toArray();

    console.log(posts);

    return posts;
  }

  static async findById(id) {
    try {
      const postsCollection = database.collection("posts");

      const post = await postsCollection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "authorDetails",
            },
          },
          {
            $unwind: "$authorDetails",
          },
          {
            $project: {
              content: 1,
              imgUrl: 1,
              tags: 1,
              createdAt: 1,
              updatedAt: 1,
              comments: 1,
              authorId: 1,
              likes: 1,
              "authorDetails.name": 1,
              "authorDetails.username": 1,
              "authorDetails.email": 1,
            },
          },
        ])
        .toArray();

      // console.log(post, 'ini dari model post');

      return post[0];
    } catch (error) {
      throw new Error("Post not found");
    }
  }

  static async createPost(content, tags, imgUrl, authorId) {
    const postsCollection = database.collection("posts");

    const timestamp = new Date();
    const newPost = {
      content,
      imgUrl,
      tags,
      authorId,
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

  static async addComment(postId, {content}, username) {
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

  static async addLike(postId, newLike, username) {
    const postsCollection = database.collection("posts");

    const existingLike = await postsCollection.findOne({
      _id: new ObjectId(postId),
      likes: { $elemMatch: { username } },
    });

    if (existingLike) {
      throw new Error("You already liked this post");
    }

    const updatedPost = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          likes: {
            ...newLike,
            username
          },
        },
      }
    );

    if (updatedPost.modifiedCount === 0) {
      throw new Error("Failed to add like");
    }

    return this.findById(postId);
  }
};
