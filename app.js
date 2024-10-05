const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const createApolloServer = require("./config/apollo");
const isAuth = require("./middlewares/auth");
const KEYS = require("./keys");
const { appDir, deleteFile } = require("./util/file");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = uuidv4() + "." + file.originalname.split(".").reverse()[0];
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(appDir, "images")));

app.use(isAuth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    const error = new Error("Not authenticated");
    error.code = 401;
    throw error;
  }
  if (!req.file) {
    return res.status(422).json({ message: "No image provided" });
  }
  if (req.body.oldPath) {
    deleteFile(req.body.oldPath);
  }

  const filePath = req.file.path.replace("\\", "/");
  return res.status(201).json({ message: "Image stored", filePath: filePath });
});

async function startServer() {
  await createApolloServer(app);

  await mongoose.connect(KEYS.MONGODB_CONNECTION_URI);
  console.log("connected to the database");
  app.listen(KEYS.PORT, () => {
    console.log(`listening to port ${KEYS.PORT}`);
  });
}

startServer();
