import Chat from "../Models/chatModel.js";
import Message from "../Models/messageModel.js";
import { io, onlineUsers } from "../socket/socket.js";

//this is for sending messages
export const sendMessage = async (req, res) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  try {
    let chat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });
    if (!chat) {
      chat = await Chat.create({
        users: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      chat.messages.push(newMessage._id);
    }

    //SOCKET Io functionality here

    // await chat.save();
    // await newMessage.save();

    //this will run in parallel
    await Promise.all([chat.save(), newMessage.save()]);

    //  Emit the saved message to the receiver
    const receiverSocketId = onlineUsers.get(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while sending message",
    });
  }
};
//this is getting messages
export const getMessage = async (req, res) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user._id;

  try {
    const chat = await Chat.findOne({
      users: { $all: [senderId, userToChatId] },
    }).populate("messages"); //not reference but actual messages
    if (!chat) return res.status(200).json([]);

    const messages = chat.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while sending message",
    });
  }
};
