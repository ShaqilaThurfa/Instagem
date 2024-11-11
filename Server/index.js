const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Sample data
const users = [
  {
    name: "Qila",
    username: "Qila123",
    email: "Qila@gmail.com",
    password: "hehehe"
  }
];

const comments = [
  {
    content: "ii kasiaan de loo",
    username: "akulucu123",
    createdAt: "11/11/2024",
    updatedAt: "11/11/2024",
  }
];
const likes = [
  {
    username: "akulucu123",
    createdAt: "11/11/2024",
    updatedAt: "11/11/2024",
  }
];

const posts = [
  {
    content: "aku sedih, duduk sendiri",
    tags: [],
    imgUrl: "https://tse1.mm.bing.net/th?id=OIP.ylpPUiCLMqNrvFFbeWvshwAAAA&pid=Api&P=0&h=180",
    authorId: 1,
    comments: [comments],
    likes: [likes],
    createdAt: "11/11/2024",
    updatedAt: "11/11/2024",
  }
];

const follows = [
  {
    followingId: 1,
    followerId: 1,
    createdAt: "String",
    updatedAt: "String",
  }
];

// Define typeDefs
const typeDefs = `#graphql
  

  type User {
    name: String
    username: String
    email: String
    password: String
  }

  type Post {
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
  }
`;


const resolvers = {
  Query: {
    users: () => users,
    posts: () => posts,
    likes: () => likes,
    comments: () => comments,
    follows: () => follows 
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
