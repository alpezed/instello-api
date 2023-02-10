const Post = require("../models/post");
const Notification = require("../models/notification");
// const User = require("../models/user");
const factory = require("./factory");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets/posts");
	},
	filename: function (req, file, cb) {
		// const ext = file.mimetype.split("/")[1];
		// const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

exports.uploadPostImages = upload.array("images");

exports.formattedUploadedImages = async (req, res, next) => {
	if (!req.files) return next();

	req.body.images = [];
	await Promise.all(
		req.files.map(
			async file =>
				await req.body.images.push(
					`http://localhost:8000/assets/posts/${file.originalname}`
				)
		)
	);
	next();
};

exports.likePost = catchAsync(async (req, res, next) => {
	const post = await Post.findByIdAndUpdate(
		req.params.id,
		{
			$addToSet: { likes: req.user.id },
		},
		{ new: true }
	);

	// const user = await User.findById(req.user.id);

	const notification = new Notification({
		message: `liked your <strong>post</strong>.`,
		recipient: post.user,
		from: req.user.id,
		doc: post._id,
		docModel: "Post",
	});

	await notification.save();

	res.status(201).json({
		status: "success",
		results: { post },
	});
});

exports.unLikePost = catchAsync(async (req, res, next) => {
	const post = await Post.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { likes: req.user.id },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { post },
	});
});

exports.addUserToPost = (req, res, next) => {
	req.body.user = req.user.id;
	next();
};

exports.getAllPosts = factory.getAll(Post, "user");
exports.getPost = factory.getOne(Post, "comments");
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);
