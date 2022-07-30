import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/auth/login", (req, res) => {
  const token = jwt.sign(
    {
      email: req.body.email,
      fullname: "Anton",
    },
    "secretkey"
  );

  res.json({
    success: true,
    token,
  });
});

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("Server has been started.");
});
