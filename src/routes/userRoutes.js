import express from "express";
import {
  handleImageUpload,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { upload } from "../helper/cloudinary.js";
const router = express.Router();
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/login", loginUser);
router.post("/register", registerUser);
export default router;
