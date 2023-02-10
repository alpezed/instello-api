const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: true,
		},
		from: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		read: {
			type: Boolean,
			default: false,
		},
		doc: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			// Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
			// will look at the `onModel` property to find the right model.
			refPath: "docModel",
		},
		docModel: {
			type: String,
			required: true,
			enum: ["Post", "Comment", "Message"],
		},
	},
	{
		timestamps: true,
	}
);

notificationSchema.pre(/^find/, function (next) {
	this.populate("doc");
	next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
