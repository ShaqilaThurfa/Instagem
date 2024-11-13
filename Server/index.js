const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { ObjectId } = require("mongodb");

const User = require("./models/User");
const Post = require("./models/Post");
const { hashPassword, checkPassword } = require("./helpers/hashingpassword");

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
  }

  type Token {
    user: User
    accessToken: String
  }

  type Post {
    id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  input CommentInput {
    content: String!
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

  type Follow {
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  type Query {
    users: [User]
    posts: [Post]
    comments: [Comment]
    likes: [Like]
    follows: [Follow]
    getUserDetail: User
    postById(id: ID!): Post
    userById(_id: ID!): User
  }

  type Mutation {
    createPost(
      content: String!
      tags: [String]
      imgUrl: String
      authorId: ID!
    ): Post

    updatePost(_id: ID!, tags: [String], content: String, imgUrl: String): Post

    login(username: String!, password: String!): Token

    register(name: String!, username: String!, email: String!, password: String!): User

    commentPost(postId: ID!, comment: CommentInput!): Post
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    posts: async () => {
      try {
        const posts = await Post.findAll();
        return posts;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    userById: async (_, { _id }) => {
      try {
        return await User.findById(new ObjectId(_id)); // Pastikan ObjectId digunakan di sini
      } catch (error) {
        throw new Error(error.message);
      }
    },
    postById: async (_, { id }) => {
      try {
        return await Post.findById(new ObjectId(id)); // Pastikan ObjectId digunakan di sini
      } catch (error) {
        throw new Error(error.message);
      }
    },
    
  },

  Mutation: {
    createPost: async (_, args) => {
      try {
        const newPost = await Post.createPost(
          args.content,
          args.imgUrl,
          args.authorId,
          args.tags
        );
        return newPost;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updatePost: async (_, args) => {
      try {
        const { _id, content, tags, imgUrl } = args;
        const post = await Post.findById(_id);

        if (!post) {
          throw new Error("Post not found");
        }

        if (content) post.content = content;
        if (tags) post.tags = tags;
        if (imgUrl) post.imgUrl = imgUrl;

        await Post.updateOne(_id, { content, tags, imgUrl });
        return post;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    register: async (_, args) => {
      try {
        const { name, username, email, password } = args;
        const hashedPassword = hashPassword(password);

        const newUser = await User.createUser({
          name,
          username,
          email,
          password: hashedPassword,
        });

        return {
          _id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (_, { username, password }) => {
      try {
        const userData = await User.login({ username, password });
        return {
          user: userData.user,
          accessToken: userData.token,
        };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    commentPost: async (_, { postId, comment }) => {
      try {
        const newComment = { content: comment.content, username: comment.username };
        const updatedPost = await Post.addComment(postId, newComment);
        return updatedPost;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 3000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
