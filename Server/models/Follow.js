const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

module.exports = class Follow {
  static async findAllUserFollowers(userId) {
    const followCollection = database.collection("follows");

    const followers = await followCollection
      .find({ followerId: new ObjectId(userId) })
      .toArray();
    return followers.map((follower) => ({
      ...follower,
      _id: follower._id.toString()
    }));
  }

  static async findAllUserFollowing(userId) {
    const followCollection = database.collection("follows");

    const following = await followCollection
      .find({ followingId: new ObjectId(userId) })
      .toArray();
    return following.map((follow) => ({
      ...follow,
      _id: follow._id.toString()
    }));
  }

  static async countFollowing(userId) {
    const followCollection = database.collection("follows");

    try {
      const result = await followCollection.aggregate([
        {
          $match: {
            followerId: new ObjectId(userId),
          },
        },
        {
          $count: "totalFollowing",
        },
      ]).toArray();
  
      return result[0]?.totalFollowing || 0;
    } catch (error) {
      throw new Error("Following not found");
    }
  }

  static async countFollowers(userId) {
    const followCollection = database.collection("follows");

    try {
      const result = await followCollection.aggregate([
        {
          $match: {
            followingId: new ObjectId(userId),
          },
        },
        {
          $count: "totalFollowers",
        },
      ]).toArray();
  
      return result[0]?.totalFollowers || 0;
    } catch (error) {       
      throw new Error("Followers not found");
    }
  }

  static async createFollow(followerId, followingId) {
    const followCollection = database.collection("follows");

    const alreadyFollowed = await followCollection.findOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
    });

    if (alreadyFollowed) {
      throw new Error("You already followed this user");
    }

    const newFollow = {
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await followCollection.insertOne(newFollow);

    return {
      ...newFollow,
      _id: result.insertedId
    };
  }

};
