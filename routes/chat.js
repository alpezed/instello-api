const express = require("express");

const chatController = require("../controllers/chat");
const authController = require("../controllers/auth");
const messageRouter = require("../routes/message");

const router = express.Router();

router.use("/:chatId/messages", messageRouter);

router.use(authController.protect);

router.route("/:userId").get(chatController.getAllChats);

router
	.route("/")
	.get(chatController.getAllChats)
	.post(chatController.createChat);

router.route("/:id").delete(chatController.deleteChat);

module.exports = router;
