const express = require("express");

const postController = require("../controllers/post");
const authController = require("../controllers/auth");
const commentRouter = require("../routes/comment");

const router = express.Router();

router.use("/:postId/comments", commentRouter);

router.use(authController.protect);

router.patch("/:id/like", postController.likePost);
router.patch("/:id/unlike", postController.unLikePost);

router
	.route("/")
	.get(postController.getAllPosts)
	.post(
		postController.uploadPostImages,
		postController.formattedUploadedImages,
		postController.addUserToPost,
		postController.createPost
	);

router
	.route("/:id")
	.get(postController.getPost)
	.patch(
		postController.uploadPostImages,
		postController.formattedUploadedImages,
		postController.updatePost
	)
	.delete(postController.deletePost);

module.exports = router;
