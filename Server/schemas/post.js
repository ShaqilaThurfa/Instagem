const { ObjectId } = require("mongodb");
const Post = require("../models/Post");
const redis = require("../config/redis");

const postTypeDefs = `#graphql
  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    authorDetails: User
  }

  input CommentInput {
    content: String!
    username: String!
  }

  input LikeInput {
  username: String!
  }

  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }

   type Query {
    posts: [Post]
    postById(id: ID!): Post
  }

   type Mutation {
    createPost(content: String!, tags: [String], imgUrl: String): Post
    updatePost(_id: ID!, tags: [String], content: String, imgUrl: String): Post
    commentPost(postId: ID!, comment: CommentInput!): Post
    likePost(postId: ID!, like: LikeInput!): Post
  }
`;

const postResolvers = {
  Query: {
    posts: async (_, __, { auth }) => {
      try {
        auth();
        console.log('masuk ga?');
        
        const memory = await redis.get("posts");
        if (memory) {
          console.log(memory, "ini dari schema post");
          return JSON.parse(memory);
        }

        redis.set("posts", JSON.stringify(await Post.findAll()));
        return await Post.findAll();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    postById: async (_, { id }, { auth }) => {
      try {
        auth();
        const data = await Post.findById(new ObjectId(id));
        console.log(data, "ini dari schema post");

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    createPost: async (_, { content, tags, imgUrl }, { auth }) => {
      try {
        auth();
        const user = auth();
        console.log(user.id, "ini user id");
        
        redis.del("posts");
        return await Post.createPost(content, tags, imgUrl, authorId= new ObjectId(user.id));
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updatePost: async (_, { _id, content, tags, imgUrl }) => {
      try {
        const post = await Post.findById(_id);
        if (!post) throw new Error("Post not found");

        return await Post.updateOne(_id, { content, tags, imgUrl });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    commentPost: async (_, { postId, comment }, { auth }) => {
      try {
        auth();
        const newComment = {
          content: comment.content,
          username: comment.username,
        };
        return await Post.addComment(postId, newComment);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    likePost: async (_, { postId, like }, { auth }) => {
      try {
        auth();
        const newLike = {
          ...like,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedPost = await Post.addLike(postId, newLike);
        return updatedPost;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = { postTypeDefs, postResolvers };
