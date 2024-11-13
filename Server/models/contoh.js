static async addComment(postId, comment) {
  const updatedPost = await this.getDatabase().updateOne(
    { _id: new ObjectId(postId) },
    { $push: { comments: comment } }
  );
  if (updatedPost.modifiedCount === 0) {
    throw new Error("Failed to add comment");
  }
  return this.findById(postId);
}
static async addLike(postId, like) {
  const updatedPost = await this.getDatabase().updateOne(
    { _id: new ObjectId(postId) },
    { $push: { likes: like } }
  );
  if (updatedPost.modifiedCount === 0) {
    throw new Error("Failed to add like");
  }
  return this.findById(postId);
}


commentPost: async (_, { postId, comment }) => {
  const newComment = {
    ...comment,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updatedPost = await Post.addComment(postId, newComment);
  return updatedPost;
}