const Post = require("../../models/post");
const User = require("../../models/user");

const { CustomError } = require("../../util/error");

exports.getPosts = async (_, args, context) => {
  try {
    const { page } = args;
    if (!req.isAuth) {
      throw new CustomError("Not authorized!", 401);
    }

    const { req } = context;

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
    throw err;
  }
};

exports.getPost = async (_, args, context) => {
  try {
    const { req } = context;
    if (!req.isAuth) {
      throw new CustomError("Not authorized", 401);
    }

    const { postId } = args;

    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      throw new CustomError("Could not find the post", 404);
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
    throw err;
  }
};

exports.addPost = async (_, args, context) => {
  try {
    const { req } = context;
    if (!req.isAuth) {
      throw new CustomError("Not authorized", 401);
    }

    const { title, content, imageUrl } = args;

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });

    const postDoc = await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

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
    throw err;
  }
};

exports.deletePost = async (_, args, context) => {
  try {
    const { req } = context;
    if (!req.isAuth) {
      throw new CustomError("Not authorized", 401);
    }

    const { postId } = args;

    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Could not find the post!", 404);
    }
    if (post.creator.toString() !== req.userId) {
      throw new CustomError("Not authorized!", 401);
    }

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    await Post.findByIdAndDelete(postId);
    return {
      code: 200,
      success: true,
      message: "Post deletion successfull!",
    };
  } catch (err) {
    throw err;
  }
};

exports.updatePost = async (_, args, context) => {
  try {
    const { req } = context;
    if (!req.isAuth) {
      throw new CustomError("Not authorized!", 401);
    }

    const {
      postId,
      title: updatedTitle,
      content: updatedContent,
      imageUrl: updatedImageUrl,
    } = args;

    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Could not find the post!", 404);
    }
    if (post.creator.toString() !== req.userId) {
      throw new CustomError("Not authorized", 401);
    }

    post.title = updatedTitle;
    post.content = updatedContent;
    post.imageUrl = updatedImageUrl;
    const postDoc = await post.save();
    const { _id, createdAt, updatedAt } = postDoc._doc;
    return {
      code: 201,
      success: true,
      message: "Post updation successfull!",
      post: {
        ...postDoc._doc,
        _id: _id.toString(),
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
      },
    };
  } catch (err) {
    throw err;
  }
};
