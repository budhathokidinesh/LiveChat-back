import express from "express";

import { upload } from "../helper/cloudinary.js";
import {
  handleImageUpload,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/upload-image", upload.single("profilePic"), handleImageUpload);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
export default router;
