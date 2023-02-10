const express = require("express");

const userController = require("../controllers/user");
const authController = require("../controllers/auth");
const notificationRouter = require("../routes/notification");
const storyRouter = require("../routes/story");

const router = express.Router();

router.use("/:userId/notifications", notificationRouter);
router.use("/:userId/stories", storyRouter);

router.use(authController.protect);

router.get("/me", userController.getMe, userController.getUser);
router.get("/follow", userController.userFollow);
router.get("/:userId/messages", userController.allMessages);
router.patch(
	"/update-me",
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateMe
);
router.get("/suggestions", userController.suggestions);
router.patch("/:id/follow", userController.addFollower, userController.follow);
router.patch(
	"/:id/unfollow",
	userController.removeFollower,
	userController.unFollow
);
router.patch("/add-friend", userController.addFriend);
router.patch("/remove-friend", userController.removeFriend);
router.patch("/add-suggestion", userController.addSuggestion);
router.patch("/remove-suggestion", userController.removeSuggestion);

router
	.route("/")
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
