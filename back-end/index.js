import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(process.env.PORT || 5555, (error) => {
  if(error) {
    return console.log(error);
  }

  console.log('Server has been started.')
})
