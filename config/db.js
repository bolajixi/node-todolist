const mongoose = require("mongoose");

const connectDb = async () => {
	let conn = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	console.log("Connecting to MongoDb Server");
};

module.exports = connectDb;
