const Comment = require("../models/comment");
// const User = require("../models/user");
const Notification = require("../models/notification");
const Post = require("../models/post");
const factory = require("./factory");
const catchAsync = require("../utils/catchAsync");

exports.createComment = catchAsync(async (req, res, next) => {
	const comment = await Comment.create(req.body);
	const post = await Post.findById(req.body.post);

	if (!post) {
		return next(new Error("Post not found."));
	}

	const notification = new Notification({
		message: `commented on <strong>your post</strong>.`,
		recipient: post.user,
		from: req.user.id,
		doc: post._id,
		docModel: "Post",
	});

	await notification.save();

	res.status(201).json({
		status: "success",
		results: { comment },
	});
});

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
// exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
