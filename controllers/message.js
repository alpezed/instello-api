const Message = require("../models/message");
const Notification = require("../models/notification");
const factory = require("./factory");
const catchAsync = require("../utils/catchAsync");

// exports.getAllMessagesByChat = catchAsync(async (req, res, next) => {
// 	const messages = await Message.find({ chat: req.params.chatId })
// 		.populate({
// 			path: "sender",
// 			select: "-following -followers -__v -status",
// 		})
// 		.populate({ path: "chat" });

// 	res.status(200).json({
// 		status: "success",
// 		results: { data: messages },
// 	});
// });

exports.createMessage = catchAsync(async (req, res, next) => {
	const newMessage = await Message.create(req.body);
	const message = await Message.findOne({ _id: newMessage._id })
		.populate("sender")
		.populate("chat");

	req.newMessage = message;

	res.status(201).json({
		status: "success",
		data: { message },
	});

	next();
});

exports.sendMessageNotification = async (req, res, next) => {
	if (!req.newMessage) {
		return next(new Error("Message not found."));
	}

	const recipient = req.newMessage.chat.users.find(
		user => user.id !== req.user.id
	);

	const notification = new Notification({
		message: req.newMessage.content,
		recipient: recipient._id,
		from: req.user.id,
		doc: req.newMessage._id,
		docModel: "Message",
	});

	await notification.save();

	next();
};

exports.getMessage = factory.getOne(Message);
exports.getAllMessages = factory.getAll(Message);
// exports.createMessage = factory.createOne(Message);
exports.updateMessage = factory.updateOne(Message);
exports.deleteMessage = factory.deleteOne(Message);
