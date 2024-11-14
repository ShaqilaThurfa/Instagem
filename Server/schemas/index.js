const { FollowtypeDefs, Followresolvers } = require("./follow");
const { postTypeDefs, postResolvers } = require("./post");
const { userTypeDefs, userResolvers } = require("./user");

const typeDefs = [FollowtypeDefs, postTypeDefs, userTypeDefs];
const resolvers = [Followresolvers, postResolvers, userResolvers];

module.exports = { typeDefs, resolvers };