const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
	{
		// chatName: {
		// 	type: String,
		// 	trim: true,
		// },
		// isGroupChat: {
		// 	type: Boolean,
		// 	default: false,
		// },
		users: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
		// latestMessage: {
		// 	type: mongoose.Schema.ObjectId,
		// 	ref: "Message",
		// },
		// groupAdmin: {
		// 	type: mongoose.Schema.ObjectId,
		// 	ref: "User",
		// },
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

chatSchema.virtual("latestMessage", {
	ref: "Message",
	foreignField: "chat",
	localField: "_id",
	justOne: true,
});

chatSchema.pre(/^find/, function (next) {
	this.populate({
		path: "users",
		select: "-following -followers -__v -status",
	});
	next();
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
