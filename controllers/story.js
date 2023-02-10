const multer = require("multer");

const Story = require("../models/story");
// const User = require("../models/user");
// const Notification = require("../models/notification");
const factory = require("./factory");
const catchAsync = require("../utils/catchAsync");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/assets/users/stories");
	},
	filename: (req, file, cb) => {
		cb(null, `${new Date().toDateString()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(null, new Error("Not an image! Please upload only an images."));
	}
};

const upload = multer({
	storage,
	fileFilter,
	// limits: {
	// 	fileSize: 1024 * 1024 * 5,
	// },
});

exports.uploadUserStory = upload.single("image");

exports.storeStoryFile = catchAsync(async (req, res, next) => {
	if (!req.file) {
		return next(new Error("Please select an image."));
	}

	req.body.user = req.user.id;
	req.body.image = req.file.filename;

	next();
});

exports.getAllStories = factory.getAll(Story);
exports.createStory = factory.createOne(Story);
exports.deleteStory = factory.deleteOne(Story);
