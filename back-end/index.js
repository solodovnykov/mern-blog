import express from "express";

import mongoose from "mongoose";
import dotenv from "dotenv";
import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

import * as UseController from "./controllers/UserController.js";

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

app.use(express.json());

app.post("/auth/register", registerValidation, UseController.register);
app.post("/auth/login", UseController.login);
app.get("/auth/me", checkAuth, UseController.getMe);

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server has been started.");
});
