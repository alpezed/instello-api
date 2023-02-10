const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		content: { type: String, trim: true },
		chat: {
			type: mongoose.Schema.ObjectId,
			ref: "Chat",
		},
	},
	{ timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
	this.populate({
		path: "sender",
		select: "-following -followers -__v -status",
	}).populate({ path: "chat" });
	next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
