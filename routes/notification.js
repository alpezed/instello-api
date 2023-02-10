const express = require("express");

const notificationController = require("../controllers/notification");
const authController = require("../controllers/auth");

const router = express.Router({
	mergeParams: true,
});

router.use(authController.protect);

router
	.route("/")
	.get(notificationController.getAllNotifications)
	.post(notificationController.createNotification);

router
	.route("/:id")
	.get(notificationController.getNotification)
	.patch(notificationController.updateNotification)
	.delete(notificationController.deleteNotification);

module.exports = router;
