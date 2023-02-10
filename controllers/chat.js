const Chat = require("../models/chat");
const catchAsync = require("../utils/catchAsync");
const factory = require("./factory");

exports.createChat = catchAsync(async (req, res, next) => {
	if (!req.body.receiverId) {
		return next(new Error("Missing receiver field"));
	}

	const newChat = await Chat.create({
		users: [req.user.id, req.body.receiverId],
	});
	const chat = await Chat.findById(newChat._id);

	res.status(201).json({
		status: "success",
		results: {
			chat,
		},
	});
});

exports.getAllChats = catchAsync(async (req, res, next) => {
	let userId = req.user.id;
	if (req.params.userId) userId = req.params.userId;

	// const chats = await Chat.find({
	// 	users: { $elemMatch: { $eq: userId } },
	// });
	const chats = await Chat.find({ users: { $in: [userId] } }).populate({
		path: "latestMessage",
		options: { sort: { createdAt: -1 } },
		match: { sender: { $ne: userId } },
	});

	res.status(201).json({
		status: "success",
		results: {
			chats,
		},
	});
});

exports.deleteChat = factory.deleteOne(Chat);
