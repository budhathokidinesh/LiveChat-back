import express from "express";
import {
  handleImageUpload,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { upload } from "../helper/cloudinary.js";

const router = express.Router();
router.post("/upload-image", upload.single("profilePic"), handleImageUpload);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
export default router;
