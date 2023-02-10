const express = require("express");

const storyController = require("../controllers/story");
const authController = require("../controllers/auth");

const router = express.Router({
	mergeParams: true,
});

router.use(authController.protect);

router
	.route("/")
	.get(storyController.getAllStories)
	.post(
		storyController.uploadUserStory,
		storyController.storeStoryFile,
		storyController.createStory
	);

router.route("/:id").delete(storyController.deleteStory);

module.exports = router;
