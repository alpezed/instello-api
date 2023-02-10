const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
	{
		comment: {
			type: String,
			required: [true, "Comment cannot be empty!"],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Comment must belong to a user."],
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: "Post",
			required: [true, "Comment must belong to a post."],
		},
	},
	{
		timestamps: true,
	}
);

commentSchema.pre(/^find/, function (next) {
	this.populate({ path: "user", select: "firstName lastName email photo" });
	next();
});

module.exports = mongoose.model("Comment", commentSchema);
