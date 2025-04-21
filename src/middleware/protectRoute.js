import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized-no token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized-invalid token",
      });
    }
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal error",
    });
  }
};
export default protectRoute;
