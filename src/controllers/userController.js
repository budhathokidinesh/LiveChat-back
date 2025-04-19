import bcrypt from "bcryptjs";
import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
//registration
export const registerUser = async (req, res) => {
  const { name, email, password, picture } = req.body;
  try {
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this email. Please enter another email",
      });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    //create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      picture,
    });
    await newUser.save();
    //success response
    res.status(201).json({
      success: true,
      message: "User has been added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured while registering the user",
    });
  }
};
//this is for login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //checking existing user
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist. Please register first",
      });
    }
    //comparing entered password and existing password
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password please try again",
      });
    }
    //creating token
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        picture: existingUser.picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    //send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        picture: existingUser.picture,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured while registering the user",
    });
  }
};
