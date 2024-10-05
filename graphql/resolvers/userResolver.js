const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const KEYS = require("../../keys");
const { CustomError } = require("../../util/error");
const { checkUser } = require("../../validators/validation");
const userValidator = require("../../validators/user");

exports.signIn = async (_, { email, password, name }) => {
  try {
    const { error } = userValidator.validateSignIn({ email, password, name });
    if (error) {
      throw new CustomError(error.details[0].message, 422);
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new CustomError("An existing user found with the email!", 422);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      posts: [],
      name: name,
    });
    const newUserDoc = await newUser.save();
    const newUserObj = newUserDoc._doc;
    delete newUserObj.password;
    const { _id, createdAt, updatedAt } = newUserObj;
    return {
      code: 201,
      success: true,
      message: "Sign up successful!",
      user: {
        ...newUserObj,
        _id: _id.toString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    };
  } catch (err) {
    throw new CustomError(err.message || "Could not Sign In", err.code || 500);
  }
};

exports.logIn = async (_, { email, password }) => {
  try {
    const { error } = userValidator.validateLogIn({ email, password });
    if (error) {
      throw new CustomError(error.details[0].message, 422);
    }

    const existingUser = await User.findOne({ email: email });
    checkUser(existingUser);
    const isPasswordEqual = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordEqual) {
      throw new CustomError("Wrong email or password!", 422);
    }

    const token = jwt.sign(
      { email: email, userId: existingUser._id.toString() },
      KEYS.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const existingUserObj = existingUser.toObject();
    delete existingUserObj.password;
    const { _id, createdAt, updatedAt } = existingUserObj;
    return {
      code: 200,
      success: true,
      message: "Log In successfull!",
      token: token,
      user: {
        ...existingUserObj,
        _id: _id.toString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      },
    };
  } catch (err) {
    throw new CustomError(err.message || "Could not Log In", err.code || 500);
  }
};
