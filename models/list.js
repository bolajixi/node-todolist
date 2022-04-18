const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, "Item name is required"],
	},
});

const listSchema = new mongoose.Schema({
	name: String,
	items: [itemsSchema],
});

module.exports = mongoose.model("List", listSchema);
