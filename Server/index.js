if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs, resolvers } = require("./schemas");
const { graphql } = require("graphql");
const { verifyToken } = require("./helpers/jwt");



const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: async ({ req }) => {
    return {
      auth: () => {
        const auth = req.headers.authorization 
        if (!req.headers.authorization) {
          throw new Error("You must be logged in");
        }
        const user = verifyToken(auth);
        return user;
      }
      
    };
  }
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
