const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const User = require("./models/User");
const Post = require("./models/Post");
const { hashPassword, checkPassword } = require("./helpers/hashingpassword");

// Sample data for posts (replace this with actual database fetching logic)
const posts = [
  {
    id: "1",
    content: "This is a sample post",
    tags: ["example", "sample"],
    imgUrl: "https://example.com/image.jpg",
    authorId: "1",
    comments: [],
    likes: [],
    createdAt: "11/11/2024",
    updatedAt: "11/11/2024",
  },
  // Add more sample posts here if needed
];

const comments = [
  {
    content: "ii kasiaan de loo",
    username: "akulucu123",
    createdAt: "11/11/2024",
    updatedAt: "11/11/2024",
  },
];
const likes = [
  {
    username: "akulucu123",
    createdAt: "11/11/2024",
    updatedAt: "11/11/2024",
  },
];

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
    userById(_id: ID!): User
    getUserDetail: User
    postById(id: ID!): Post
  }

  type Mutation {
    createPost(
      _id: ID!
      content: String!
      tags: [String]
      imgUrl: String
      authorId: ID!
      createdAt: String
      updatedAt: String
    ): Post

    updatePost(_id: ID!, tags: [String], content: String, imgUrl: String): Post

    login(username: String!, password: String!): Token

    register(name: String!, username: String!, email: String!, password: String!): User
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
    postById: async (_, { id }) => {
      try {
        return posts.find((post) => post.id === id);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    createPost: async (_, args) => {
      console.log(args.content, args.imgUrl, args.authorId);

      try {
        const newPost = await Post.createPost(
          args.content,
          args.tags,
          args.imgUrl,
          args.authorId
        );
        return newPost;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updatePost: async (_, args) => {
      try {
        const { _id, content, tags, imgUrl } = args;

        const postIndex = posts.findIndex((post) => post.id === _id);

        if (postIndex === -1) {
          throw new Error("Post not found");
        }

        const updatedPost = posts[postIndex];
        if (content) updatedPost.content = content;
        if (tags) updatedPost.tags = tags;
        if (imgUrl) updatedPost.imgUrl = imgUrl;

        return updatedPost;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    register: async (_, args) => {
      try {
        const { name, username, email, password } = args;
        // console.log(name, username, email, password);
        
        const hashedPassword = hashPassword(password);

        const newUser = await User.createUser({
          name,
          username,
          email,
          password: hashedPassword,
        });

        // console.log(newUser);
        

        return {
          _id: newUser._id,  
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        }

      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (_, { username, password }) => {
      try {

        const userData = await User.login({ username, password });
        // console.log(userData);
        
        return {
          user: userData.user,
          accessToken: userData.token,
        }
        
        
        
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
