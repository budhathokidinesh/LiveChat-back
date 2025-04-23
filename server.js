import express from "express";
import cookieparser from "cookie-parser";
import morgan from "morgan";

import cors from "cors";
const PORT = process.env.PORT || 8000;

//importing routes
import authRoutes from "./src/routes/authRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

//middlewares
import { app, server } from "./src/socket/socket.js";
app.use(morgan("dev"));
app.use(cookieparser());
app.use(express.json());

//this is for cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // or any allowed domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/chat", chatRoutes);

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
