const postSchema = require("./schemas/feedSchema");
const userSchema = require("./schemas/userSchema");

const typeDefs = [postSchema, userSchema];

module.exports = typeDefs;
