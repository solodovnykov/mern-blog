import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import sharp from "sharp";

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
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

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

app.post("/upload", checkAuth, upload.single("image"), async (req, res) => {
  try {
    // const { path, originalname } = req.file;
    // const timestamp = new Date().toISOString();
    // const ref = `${timestamp}-${originalname}.webp`;
    // console.log("req.file:", req.file);

    // await sharp(path)
    //   .webp({ quality: 20 })
    //   .toFile("./uploads/" + ref);
    res.json({
      url: `/uploads/${req.file.originalname}`,
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
