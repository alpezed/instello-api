const express = require("express");

const messageController = require("../controllers/message");
const authController = require("../controllers/auth");

const router = express.Router({
	mergeParams: true,
});

router.use(authController.protect);

// router.get("/:chatId", messageController.getAllMessages);

router
	.route("/")
	.get(messageController.getAllMessages)
	.post(
		messageController.createMessage,
		messageController.sendMessageNotification
	);

router
	.route("/:id")
	.get(messageController.getMessage)
	.patch(messageController.updateMessage)
	.delete(messageController.deleteMessage);

module.exports = router;
