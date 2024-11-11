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
  }
`;


const resolvers = {
  Query: {
    users: () => users,
    posts: () => [] 
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
