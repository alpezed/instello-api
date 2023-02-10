const Notification = require("../models/notification");
const factory = require("./factory");

exports.getNotification = factory.getOne(Notification);
exports.getAllNotifications = factory.getAll(Notification, "from");
exports.createNotification = factory.createOne(Notification);
exports.updateNotification = factory.updateOne(Notification);
exports.deleteNotification = factory.deleteOne(Notification);
