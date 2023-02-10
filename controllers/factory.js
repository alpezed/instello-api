const mongoose = require("mongoose");

const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.getAll = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let filter = {};

		if (req.params.chatId) {
			if (Model.modelName === "Message") {
				filter = { chat: req.params.chatId };
			}
		}

		if (req.params.userId) {
			if (Model.modelName === "Notification") {
				filter = { recipient: req.params.userId };
			} else {
				filter = { user: req.params.userId };
			}
		}

		if (req.params.postId) filter = { post: req.params.postId };

		// EXECUTE QUERY
		const feature = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		if (popOptions) feature.query.populate(popOptions);
		const docs = await feature.query;

		res.status(200).json({
			status: "success",
			results: { data: docs },
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (Model.modelName === "User") {
			let filter = { slug: req.params.id };
			if (mongoose.isValidObjectId(req.params.id)) {
				filter = { _id: req.params.id };
			}
			query = Model.findOne(filter);
		}
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(new Error("No document found with that ID"));
		}

		res.status(200).json({
			status: "success",
			results: { data: doc },
		});
	});

exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: "success",
			results: { data: doc },
		});
	});

exports.updateOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});

		res.status(201).json({
			status: "success",
			results: { data: doc },
		});
	});

exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		await Model.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: "success",
			data: null,
		});
	});
