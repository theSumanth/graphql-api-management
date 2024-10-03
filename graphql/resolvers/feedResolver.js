const Post = require("../../models/post");
const User = require("../../models/user");

exports.getPosts = async (_, args, context) => {
  try {
    const { page } = args;
    const { req } = context;
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

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
      code: 200,
      success: true,
      message: "Retrieved posts successfully",
      totalItems: totalPostsCount,
      posts: posts.map((p) => {
        return {
          ...p.toObject(),
          _id: p._id.toString(),
          createdAt: p.createdAt.toString(),
          updatedAt: p.updatedAt.toString(),
        };
      }),
    };
  } catch (err) {
    return {
      code: err.code || 500,
      success: false,
      message: err.message || "Failed to fetch posts!",
    };
  }
};

exports.getPost = async (_, args, context) => {
  try {
    const { req } = context;
    const { postId } = args;

    if (!req.isAuth) {
      const error = new Error("Not authorized");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Could not find the post");
      error.code = 404;
      throw error;
    }

    const { _id, createdAt, updatedAt } = post;
    return {
      code: 200,
      success: true,
      message: "Retrieved the post successfully",
      post: {
        ...post.toObject(),
        _id: _id.toString(),
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
      },
    };
  } catch (err) {
    return {
      code: err.code || 500,
      success: false,
      message: err.message || "Failed to fetch posts!",
    };
  }
};

exports.addPost = async (_, { title, content, imageUrl, creator }, context) => {
  try {
    const { req } = context;
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: creator,
    });

    const postDoc = await post.save();
    const { _id, createdAt, updatedAt } = postDoc._doc;
    return {
      code: 201,
      success: true,
      message: "Added the post!",
      post: {
        ...postDoc._doc,
        _id: _id.toString(),
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
      },
    };
  } catch (err) {
    return {
      code: err.code || 500,
      success: false,
      message: err.message || "Failed to add the post!",
    };
  }
};
