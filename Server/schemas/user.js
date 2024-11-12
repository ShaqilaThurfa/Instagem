const User= require("../models/User")

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
    
    // posts: () => posts,
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
