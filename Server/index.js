const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const User = require("./models/User");
const Post = require('./models/Post');

// Sample data
// const users = [
//   {
//     id: 1,
//     name: "Qila",
//     username: "Qila123",
//     email: "Qila@gmail.com",
//     password: "hehehe"
//   },
//   {
//     id: 2,
//     name: "Qili",
//     username: "Qili123",
//     email: "Qili@gmail.com",
//     password: "hehehe"
//   }
// ];

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


// {"_id":{"$oid":"6732ee52847a1f02c6535fac"},"content":"ii kasiaan de loo","tags":["sedih","sad","galau"], "imgUrl":"https://tse1.mm.bing.net/th?id=OIP.ylpPUiCLMqNrvFFbeWvshwAAAA&pid=Api&P=0&h=180", "authorId": "673234bc847a1f02c6dc8310","createdAt":"2024-11-12T05:56:51.025Z","updatedAt":"2024-11-12T05:56:51.025Z"}
// const posts = [
//   {
//     content: "aku sedih, duduk sendiri",
//     tags: [],
//     imgUrl: "https://tse1.mm.bing.net/th?id=OIP.ylpPUiCLMqNrvFFbeWvshwAAAA&pid=Api&P=0&h=180",
//     authorId: 1,
//     comments: [comments],
//     likes: [likes],
//     createdAt: "11/11/2024",
//     updatedAt: "11/11/2024",
//   }
// ];

// const follows = [
//   {
//     followingId: 1,
//     followerId: 1,
//     createdAt: "String",
//     updatedAt: "String"
//   }
// ]

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
    userById(id: ID!): User
  }

  type Mutation {
    addUser(
    id: Int,
    name: String,
    username: String,
    email: String,
    password: String): User
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
      try{
        const posts = await Post.findAll();
        return posts
      } catch(error){
        throw new Error(error.message);
      }
    },
    // likes: () => likes,
    // comments: () => comments,
    // follows: () => follows, 
    // userById: (_, args) => {
    //   return users.find((user) => user.id == args.id);
    // }
  },

  // Mutation: {
  //   addUser: (_, args) => {
  //    const newUser = ({...args})
  //    users.push(newUser);
  //    return newUser
  //   }
  // }
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
