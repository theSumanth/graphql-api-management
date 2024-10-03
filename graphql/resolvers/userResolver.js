const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");
const KEYS = require("../../keys");

const userResolver = {
  Mutation: {
    signIn: async (_, { email, password, name }) => {
      try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          const error = new Error("An existing user found with the email!");
          error.code = 422;
          throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
          email: email,
          password: hashedPassword,
          posts: [],
          name: name,
        });
        const newUserDoc = await newUser.save();
        const { _id, createdAt, updatedAt } = newUserDoc._doc;
        return {
          code: 201,
          success: true,
          message: "Sign up successful!",
          user: {
            ...newUserDoc._doc,
            _id: _id.toString(),
            createdAt: createdAt.toString(),
            updatedAt: updatedAt.toString(),
          },
        };
      } catch (err) {
        return {
          code: err.code || 500,
          success: false,
          message: err.message || "Sign up failed!",
        };
      }
    },
    logIn: async (_, { email, password }) => {
      try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
          const error = new Error("No user found for the email!");
          error.code = 422;
          throw error;
        }
        const isPasswordEqual = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordEqual) {
          const error = new Error("Wrong email or password!");
          error.code = 422;
          throw error;
        }

        const token = jwt.sign(
          { email: email, userId: existingUser._id.toString() },
          KEYS.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        const { _id, createdAt, updatedAt } = existingUser;

        return {
          code: 200,
          success: true,
          message: "Log In successfull!",
          token: token,
          user: {
            ...existingUser,
            _id: _id.toString(),
            createdAt: createdAt.toString(),
            updatedAt: updatedAt.toString(),
          },
        };
      } catch (err) {
        return {
          code: err.code || 500,
          success: false,
          message: err.message || "Failed to login",
        };
      }
    },
  },
};

module.exports = userResolver;
