import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import sharp from "sharp";
import path from "path";
import fs from "fs";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";
import {
  UserController,
  PostController,
  UploadController,
} from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

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
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".webp");
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads/resized", express.static("uploads/resized"));

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.delete("/upload/:imageUrl", checkAuth, UploadController.deleteImage);
app.post(
  "/upload",
  checkAuth,
  upload.single("image"),
  UploadController.uploadImage
);

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  PostController.update
);

app.patch("/posts/like/:id", checkAuth, PostController.like);
app.patch("/posts/unlike/:id", checkAuth, PostController.unlike);

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
