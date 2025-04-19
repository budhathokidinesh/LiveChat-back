import express from "express";
import morgan from "morgan";
const app = express();
import cors from "cors";
const PORT = process.env.PORT || 8000;

import { chats } from "./data/data.js";
import { dbConnect } from "./dbConfig/dbConfig.js";

//importing routes
import userRoutes from "./src/routes/userRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

//middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // or any allowed domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//Endpoints
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is live");
});

dbConnect()
  .then(() => {
    app.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("Server is running at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));
app.use(errorHandler);
