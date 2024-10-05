const Post = require("../../models/post");
const User = require("../../models/user");

const { CustomError } = require("../../util/error");
const {
  checkAuthentication,
  checkUserHasAccess,
  checkUser,
  checkPost,
} = require("../../validators/validation");
const postValidator = require("../../validators/post");

exports.getPosts = async (_, args, context) => {
  try {
    const { req } = context;
    checkAuthentication(req);
    const { page } = args;

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
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Could not fetch Posts!",
      err.code || 500
    );
  }
};

exports.getPost = async (_, args, context) => {
  try {
    const { req } = context;
    checkAuthentication(req);
    const { postId } = args;

    const post = await Post.findById(postId).populate("creator");
    checkPost(post);

    const { _id, createdAt, updatedAt } = post;
    return {
      code: 200,
      success: true,
      message: "Retrieved the post successfully",
      post: {
        ...post.toObject(),
        _id: _id.toString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Could not fetch Post",
      err.code || 500
    );
  }
};

exports.addPost = async (_, args, context) => {
  try {
    const { req } = context;
    checkAuthentication(req);
    const { title, content, imageUrl } = args;
    const { error } = postValidator.validatePost({ title, content, imageUrl });
    if (error) {
      throw new CustomError(error.details[0].message, 422);
    }

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });

    const postDoc = await post.save();
    const user = await User.findById(req.userId);
    checkUser(user);
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
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Could not create the post",
      err.code || 500
    );
  }
};

exports.deletePost = async (_, args, context) => {
  try {
    const { req } = context;
    checkAuthentication(req);
    const { postId } = args;

    const post = await Post.findById(postId);
    checkPost(post);
    checkUserHasAccess(post, req);
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(req.userId);
    checkUser(user);
    user.posts.pull(postId);
    await user.save();

    return {
      code: 200,
      success: true,
      message: "Post deletion successfull!",
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Could not delete the post",
      err.code || 500
    );
  }
};

exports.updatePost = async (_, args, context) => {
  try {
    const { req } = context;
    checkAuthentication(req);
    const {
      postId,
      title: updatedTitle,
      content: updatedContent,
      imageUrl: updatedImageUrl,
    } = args;
    const { error } = postValidator.validatePost({
      updatedTitle,
      updatedContent,
      updatedImageUrl,
    });
    if (error) {
      throw new CustomError(error.details[0].message, 422);
    }

    const post = await Post.findById(postId);
    checkPost(post);
    checkUserHasAccess(post, req);

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
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    };
  } catch (err) {
    throw new CustomError(
      err.message || "Could not update the post",
      err.code || 500
    );
  }
};
