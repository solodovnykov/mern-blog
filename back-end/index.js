import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";

import checkAuth from "./utils/checkAuth.js";

import * as UseController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.w9q0fbx.mongodb.net/blog?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("DB is OK");
  })
  .catch((error) => console.log("Db Error", error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/auth/register", registerValidation, UseController.register);
app.post("/auth/login", loginValidation, UseController.login);
app.get("/auth/me", checkAuth, UseController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
