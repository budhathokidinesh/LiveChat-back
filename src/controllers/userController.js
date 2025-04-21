import User from "../Models/userModel.js";
export const getUsers = async (req, res) => {
  const loggedInUserId = req.user._id;
  try {
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while fetching users",
    });
  }
};
