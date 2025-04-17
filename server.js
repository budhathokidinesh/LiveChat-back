import express from "express";
import morgan from "morgan";
const app = express();
const PORT = process.env.PORT || 8000;

import { chats } from "./data/data.js";

app.use(morgan("dev"));
app.use(express.json());

//server status
app.get("/", (req, res) => {
  res.send("Server is live");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res) => {
  //   console.log(req.params.id);
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log("Server is running at http://localhost:" + PORT);
});
