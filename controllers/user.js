const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/user");
const Message = require("../models/message");
const factory = require("./factory");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

const storage = multer.memoryStorage();

const upload = multer({ storage });

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = req.file.originalname;

	sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/assets/users/${req.file.filename}`);

	next();
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user.slug;
	next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTS password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new Error(
				"This route is not for password updates. Please use /update-password"
			)
		);
	}

	// 2) Filtered out unwanted fields name that are not allowed to be updated
	// const filteredBody = filterObj(req.body, "name", "email");
	if (req.file) req.body.photo = req.file.filename;

	// 2) Update user document
	const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user: updatedUser,
		},
	});
});

exports.addFollower = catchAsync(async (req, res, next) => {
	if (req.params.id === req.user.id) {
		return next(new Error("You cannot follow yourself"));
	}

	const user = await User.findById(req.params.id);
	if (user.followers.includes(req.user.id)) {
		return next(new Error("You already followed the user"));
	}

	await user.update({
		$addToSet: { followers: req.user.id },
	});
	next();
});

exports.removeFollower = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { followers: req.user.id },
		},
		{ new: true }
	);
	next();
});

exports.follow = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$addToSet: { following: req.params.id },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { user },
	});
});

exports.unFollow = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$pull: { following: req.params.id },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { user },
	});
});

exports.userFollow = catchAsync(async (req, res, next) => {
	const currentUser = await User.findById(req.user.id);
	const users = await User.find();

	const usersToFollow = users.filter(
		user =>
			!currentUser.following.includes(user.id) && user.id !== currentUser.id
	);

	res.status(201).json({
		status: "success",
		results: { users: usersToFollow.splice(0, 4) },
	});
});

exports.allMessages = catchAsync(async (req, res, next) => {
	const feature = new APIFeatures(
		Message.find({ sender: { $eq: req.params.userId } }),
		req.query
	)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const messages = await feature.query;

	res.status(200).json({
		status: "success",
		results: { messages: messages },
	});
});

exports.addFriend = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$addToSet: { friends: req.body.friendId },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { user },
	});
});

exports.removeFriend = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$pull: { friends: req.body.friendId },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { user },
	});
});

exports.suggestions = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user.id)
		.populate("friends")
		.populate("suggestions");

	// Filter out friends and users that have already been suggested
	const potentialSuggestions = await User.find({
		$and: [
			{ _id: { $ne: req.user.id } },
			{ _id: { $nin: user.friends.concat(user.suggestions) } },
		],
	});

	res.status(200).json({
		status: "success",
		suggestions: potentialSuggestions,
	});
});

exports.addSuggestion = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$addToSet: { suggestions: req.body.friendId },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { user },
	});
});

exports.removeSuggestion = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$pull: { suggestions: req.body.friendId },
		},
		{ new: true }
	);

	res.status(201).json({
		status: "success",
		results: { user },
	});
});

exports.getAllUsers = factory.getAll(User, "posts");
exports.getUser = factory.getOne(User, "posts");
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
