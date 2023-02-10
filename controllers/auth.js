const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../models/user");

module.exports = {
	signup: async (req, res) => {
		try {
			const newUser = await User.create(req.body);

			newUser.password = undefined;

			res.status(201).json({
				status: "success",
				data: { user: newUser },
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				error,
			});
		}
	},
	login: async (req, res) => {
		try {
			if (!req.body.email || !req.body.password) {
				return res.status(400).json({
					status: "fail",
					message: "Please provide email and password!",
				});
			}

			const user = await User.findOne({ email: req.body.email }).select(
				"+password"
			);
			if (!user) {
				return res
					.status(404)
					.json({ status: "fail", message: "User not found" });
			}

			if (!(await user.correctPassword(req.body.password, user.password))) {
				return res
					.status(401)
					.json({ status: "fail", message: "Incorrect email or password" });
			}

			const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET, {
				expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
			});

			user.password = undefined;

			res.status(201).json({
				status: "success",
				token,
				data: { user },
			});
		} catch (error) {
			res.status(400).json({
				status: "fail",
				error,
			});
		}
	},
	protect: async (req, res, next) => {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res.status(401).json({
				status: "fail",
				message: "You are not logged in! Please log in to get access.",
			});
		}

		const jwtVerify = util.promisify(jwt.verify);
		const { id: userId } = await jwtVerify(token, process.env.JWT_TOKEN_SECRET);

		const currentUser = await User.findById(userId);
		if (!currentUser) {
			return res.status(401).json({
				status: "fail",
				message: "The user belonging to this token does no longer exists.",
			});
		}

		// TODO: Check if user changed password after the token was issued

		req.user = currentUser;
		next();
	},
};
