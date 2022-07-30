import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);
  res.json({
    success: true,
  });
});

app.listen(process.env.PORT || 5555, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("Server has been started.");
});
