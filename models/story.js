const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			require: [true, "Story must belong to a user."],
		},
		image: {
			type: String,
			require: [true, "Image is required"],
		},
		text: {
			type: String,
		},
		expiresAt: {
			type: Date,
			default: Date.now,
			expires: 86400,
		},
	},
	{
		timestamps: true,
	}
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
