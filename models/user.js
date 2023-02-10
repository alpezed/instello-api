const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const slugify = require("slugify");

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "Please enter your first name"],
		},
		lastName: {
			type: String,
			required: [true, "Please enter your last name"],
		},
		email: {
			type: String,
			required: [true, "Please enter your email"],
			unique: true,
			lowercase: true,
		},
		slug: String,
		bio: String,
		location: String,
		workingAt: String,
		status: {
			type: String,
			enum: ["none", "single", "in-relationship", "married", "engaged"],
			default: "none",
		},
		photo: {
			type: String,
			default: "default.jpg",
		},
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		suggestions: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		password: {
			type: String,
			required: [true, "Please provide password"],
			minlength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "Please confirm your password"],
			validate: {
				validator: function (value) {
					return value === this.password;
				},
				message: "Password are not same",
			},
		},
	},
	{
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// userSchema.pre("aggregate", function (next) {
// 	this.pipeline().unshift({
// 		$match: { secretTour: { $eq: true } },
// 	});
// 	next();
// });

userSchema.virtual("posts", {
	ref: "Post",
	foreignField: "user",
	localField: "_id",
	// justOne: true,
	count: true,
});

userSchema.virtual("story", {
	ref: "Story",
	foreignField: "user",
	localField: "_id",
	justOne: true,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.slug = slugify(`${this.firstName} ${this.lastName}`, { lower: true });

	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);
	this.passwordConfirm = undefined;
});

userSchema.pre(/^find/, function (next) {
	this.populate({ path: "friends", select: "-__v -updatedAt" }).populate({
		path: "story",
		options: { sort: { createdAt: -1 } },
	});
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.virtual("photoUrl").get(function () {
	return `https://instello-api.onrender.com/assets/users/${this.photo}`;
});

module.exports = mongoose.model("User", userSchema);
