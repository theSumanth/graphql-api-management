const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const KEYS = require("../../keys");
const { CustomError } = require("../../util/error");

exports.signIn = async (_, { email, password, name }) => {
  try {
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
    const {
      _id,
      createdAt,
      updatedAt,
      password: ps,
      ...newUserWithoutPassword
    } = newUserDoc._doc;
    return {
      code: 201,
      success: true,
      message: "Sign up successful!",
      user: {
        ...newUserWithoutPassword,
        _id: _id.toString(),
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
      },
    };
  } catch (err) {
    throw new CustomError(err.message, err.code);
  }
};

exports.logIn = async (_, { email, password }) => {
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      throw new CustomError("No user found for the email!", 422);
    }
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

    const {
      _id,
      createdAt,
      updatedAt,
      password: ps,
      ...existingUserWithoutPassword
    } = existingUser.toObject();
    return {
      code: 200,
      success: true,
      message: "Log In successfull!",
      token: token,
      user: {
        ...existingUserWithoutPassword,
        _id: _id.toString(),
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString(),
      },
    };
  } catch (err) {
    throw new CustomError(err.message, err.code);
  }
};
