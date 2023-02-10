const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const notificationRouter = require("./routes/notification");
const storyRouter = require("./routes/story");

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(express.json({ limit: "50kb" }));
app.use("/assets", express.static(`${__dirname}/public/assets`));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/stories", storyRouter);

app.all("*", (req, res, next) => {
	next(new Error(`Can't find ${req.originalUrl} on this server`));
});
app.use((err, req, res, next) => {
	res.status(500).json({
		status: "fail",
		error: err,
		message: err.message,
		stack: err.stack,
	});
	// res.status(err.statusCode).json({
	// 	status: err.status,
	// 	error: err,
	// 	message: err.message,
	// 	stack: err.stack,
	// });
});

module.exports = app;
