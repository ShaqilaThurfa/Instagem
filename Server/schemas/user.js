
const { hashPassword } = require('../helpers/hashingpassword');
const User = require('../models/User');
const { ObjectId } = require('mongodb');

const userTypeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String
    followers: [User]
    followings: [User]
  }

  type Token {
    user: User
    accessToken: String
  }

   type Query {
    users: [User]
    # getUserDetail: User
    userById(_id: ID!): User
    search(query: String!): [User]
  }

   type Mutation {
    register(name: String!, username: String!, email: String!, password: String!): String
    login(username: String!, password: String!): Token
  }
`;


const userResolvers = {
  Query: {
    users: async () => {
      try {
        return await User.findAll();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    userById: async (_, { _id }, { auth }) => {
      try {
        auth();
        const user = await User.findById(new ObjectId(_id));
        // console.log(user, 'ini user di schema');

        return user;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    search: async (_, { query }, { auth }) => {
      try {
        auth();
        return await User.search(query);
      } catch (err) {
        throw new Error(err.message);
      }
    }
  },

  Mutation: {
    register: async (_, { name, username, email, password }) => {
      try {
        const hashedPassword = hashPassword(password);
        await User.createUser({
          name,
          username,
          email,
          password: hashedPassword,
        });
        return "Register success!";
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
    }
  }
};

module.exports = { userTypeDefs, userResolvers };
