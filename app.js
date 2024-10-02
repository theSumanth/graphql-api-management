const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");

const createApolloServer = require("./config/apollo");
const KEYS = require("./keys");

const app = express();

app.use(cors());
app.use(bodyParser.json());

async function startServer() {
  await createApolloServer(app);

  app.listen(KEYS.PORT, () => {
    console.log(`listening to port ${KEYS.PORT}`);
  });
}

startServer();
