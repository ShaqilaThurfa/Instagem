const { database } = require("../config/mongodb");

class User {
  static async findAll() {
    const userscollection = database.collection("users")

    
    // Query for movies that have a runtime less than 15 minutes
    // const query = { runtime: { $lt: 15 } };
    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { name: 1, email: 1, username: 1},
    };

   
    const users = await userscollection.find({}, options).toArray();
    // Print a message if no documents were found
    return users

  }
}

module.exports = User