const Post = require("../../models/post");
const User = require("../../models/user");

const postResolver = {
  Query: {
    getPosts: async (_, { page }) => {
      const ITEMS_PER_PAGE = 2;
      if (!page) {
        page = 1;
      }
      const totalPostsCount = await Post.countDocuments();
      const posts = await Post.find()
        .populate({
          path: "creator",
        })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
      return {
        posts: posts.map((p) => {
          return {
            ...p,
            _id: p._id.toString(),
            createdAt: p.createdAt.toString(),
            updatedAt: p.updatedAt.toString(),
          };
        }),
      };
    },
  },
  Mutation: {
    addPost: async (_, { title, content, imageUrl, creator }) => {
      const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: creator,
      });

      const postDoc = await post.save();
      const { _id, createdAt, updatedAt } = postDoc._doc;
      return {
        post: {
          ...postDoc._doc,
          _id: _id.toString(),
          createdAt: createdAt.toString(),
          updatedAt: updatedAt.toString(),
        },
      };
    },
  },
};

module.exports = postResolver;
