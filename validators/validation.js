const { CustomError } = require("../util/error");

const checkAuthentication = (req) => {
  if (!req.isAuth) {
    throw new CustomError("Not authorized!", 401);
  }
};

const checkUserHasAccess = (post, req) => {
  if (post.creator.toString() !== req.userId) {
    throw new CustomError("Not authorized!", 401);
  }
};

const checkUser = (user) => {
  if (!user) {
    throw new CustomError("User not found!", 404);
  }
};

const checkPost = (post) => {
  if (!post) {
    throw new CustomError("Post not found", 404);
  }
};

module.exports = {
  checkAuthentication,
  checkPost,
  checkUser,
  checkUserHasAccess,
};
