const express = require("express");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const dotenv = require("dotenv");
const app = express();
const Item = require("./models/items");
const List = require("./models/list");
const _ = require("lodash");

dotenv.config({ path: "./config/config.env" });
connectDb();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
	let today = new Date();
	let options = { weekday: "long", day: "numeric", month: "long" };

	let day = today.toLocaleDateString("en-US", options);

	let items = await Item.find();

	res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", async (req, res) => {
	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName,
	});

	if (listName === "Today") {
		item.save();
		res.redirect("/");
	} else {
		List.findOne({ name: listName }, function (err, foundList) {
			foundList.items.push(item);
			foundList.save();
			res.redirect(`/${listName}`);
		});
	}
});

app.get("/:customListName", (req, res) => {
	const customListName = _.capitalize(req.params.customListName);
	// const customListName = req.body.customListName;

	List.findOne({ name: customListName }, async (err, foundList) => {
		if (!err && !foundList) {
			const list = await List.create({
				name: customListName,
				items: [],
			});
			res.redirect(`/${customListName}`);
		} else {
			res.render("list", {
				listTitle: foundList.name,
				newListItems: foundList.items,
			});
		}
	});
});

app.post("/delete", async (req, res) => {
	let checkedItemId = req.body.checkbox;
	let listName = req.body.listName;

	if (listName === "Today") {
		await Item.findByIdAndRemove(checkedItemId);
		res.redirect("/");
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkedItemId } } },
			function (err, foundList) {
				if (!err) {
					res.redirect(`/${listName}`);
				}
			}
		);
	}
});

let PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
