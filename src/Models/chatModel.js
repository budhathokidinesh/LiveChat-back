import mongoose from "mongoose";
const chatModel = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isChatGroup: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamp: true,
  }
);
export default mongoose.model("Chat", chatModel);
