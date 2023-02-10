const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
	{
		images: {
			type: [String],
			// required: [true, "Please upload a photo"],
		},
		body: String,
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Post must belong to a user."],
		},
		likes: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

postSchema.virtual("comments", {
	ref: "Comment",
	foreignField: "post",
	localField: "_id",
});

postSchema.pre(/^find/, function (next) {
	this.populate({
		path: "likes",
		select: "-__v -following -followers -status",
	}).populate("user");
	next();
});

module.exports = mongoose.model("Post", postSchema);
