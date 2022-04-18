const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, "Item name is required"],
	},
});

module.exports = mongoose.model("items", itemsSchema);
