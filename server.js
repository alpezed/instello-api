const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = require("./app");

mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB connection successful!"));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
	console.log(`App running on port ${PORT}...`);
});

const io = new Server(server, {
	pingTimeout: 60000,
	cors: {
		origin: "http://localhost:3005",
	},
});

io.on("connection", socket => {
	socket.on("setup", userData => {
		socket.join(userData.id);
		socket.emit("connected");
	});

	socket.on("join chat", room => {
		socket.join(room);
		console.log("User Join Room: " + room);
	});

	socket.on("typing", room => socket.in(room).emit("typing"));
	socket.on("stop typing", room => socket.in(room).emit("stop typing"));

	socket.on("new message", newMessageReceived => {
		const chat = newMessageReceived.chat;

		// make sure the chat has a users
		if (!chat.users) return;

		chat.users.forEach(user => {
			if (user.id == newMessageReceived.sender.id) return;

			// socket.emit("received", newMessageReceived);
			socket.in(user.id).emit("message received", newMessageReceived);
		});
	});
});
