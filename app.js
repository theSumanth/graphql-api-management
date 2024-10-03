const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");

const createApolloServer = require("./config/apollo");
const isAuth = require("./middlewares/auth");
const KEYS = require("./keys");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(isAuth);

async function startServer() {
  await createApolloServer(app);

  await mongoose.connect(KEYS.MONGODB_CONNECTION_URI);
  console.log("connected to the database");
  app.listen(KEYS.PORT, () => {
    console.log(`listening to port ${KEYS.PORT}`);
  });
}

startServer();
