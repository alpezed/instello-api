const express = require("express");
const commentController = require("../controllers/comment");
const authController = require("../controllers/auth");
const { addUser } = require("../middleware/addUser");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
	.route("/")
	.get(commentController.getAllComments)
	.post(addUser, commentController.createComment);
router
	.route("/:id")
	.get(commentController.getComment)
	.patch(commentController.updateComment)
	.delete(commentController.deleteComment);

module.exports = router;
