import express from "express";
import cookieparser from "cookie-parser";
import morgan from "morgan";
const app = express();
import cors from "cors";
const PORT = process.env.PORT || 8000;

//importing routes
import userRoutes from "./src/routes/userRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

//middlewares
app.use(morgan("dev"));
app.use(cookieparser());
app.use(express.json());

//this is for cors
app.use(
  cors({
    origin: "http://localhost:5173", // or any allowed domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//this is for socket.io
import { Server } from "socket.io";
import { createServer } from "http";
const server = new createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Id", socket.id);

  //this is for sending message
  socket.on("send-message", (data) => {
    socket.broadcast.emit("recieve-message", data);
  });
  //this is for disconnect
  socket.on("disconnect", () => {
    console.log("User is disconnected");
  });
});

//Endpoints
app.use("/api/user", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Server is live");
// });
//this is for dbconnect
import { dbConnect } from "./dbConfig/dbConfig.js";

dbConnect()
  .then(() => {
    server.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("Server is running at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));
app.use(errorHandler);
