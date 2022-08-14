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
import { UserController, PostController } from "./controllers/index.js";
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

app.delete("/upload/:imageUrl", checkAuth, async (req, res) => {
  try {
    const url = req.params.imageUrl;

    fs.access(`./uploads/resized/${url}`, (error) => {
      if (error) {
        console.warn(error);
      } else {
        fs.unlinkSync(`./uploads/resized/${url}`);
      }
    });

    res.status(200).send("Image was deleted.");
  } catch (error) {
    console.log(error);
  }
});

app.post("/upload", checkAuth, upload.single("image"), async (req, res) => {
  try {
    const { filename: image } = req.file;

    await sharp(req.file.path)
      .resize({
        width: 1920,
        fit: sharp.fit.contain,
      })
      .webp({ quality: 80 })
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);

    res.json({
      url: `/uploads/resized/${image}`,
    });
  } catch (error) {
    console.log(error);
  }
});

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

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
