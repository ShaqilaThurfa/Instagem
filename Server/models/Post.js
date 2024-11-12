const { database } = require("../config/mongodb");

module.exports = class Post {
  static async findAll() {
    const postscollection = database.collection("posts")

    
    // Query for movies that have a runtime less than 15 minutes
    // const query = { runtime: { $lt: 15 } };
    const options = {
      // Sort returned documents in ascending order by title (A->Z)
      sort: { name: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { content: 1, username: 1},
    };

   
    const posts = await postscollection.find({}, options).toArray();
    // Print a message if no documents were found
    return posts

  }


  static async createPost(newPost) {
    const postscollection = database.collection("posts")

    const result = await postscollection.insertOne(newPost)
   
    return result

  }
}

// module.exports = User