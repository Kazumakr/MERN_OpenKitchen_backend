const router = require("express").Router();
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);
			res.status(200).json(updatedUser);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(401).json("You can update only your account");
	}
});

router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			try {
				await Recipe.deleteMany({ username: user.username });
				await User.findByIdAndDelete(req.params.id);
				res.status(200).json("User has been deleted...");
			} catch (err) {
				res.status(500).json(err);
			}
		} catch (err) {
			res.status(404).json("User not found");
		}
	} else {
		res.status(401).json("You can delete only your account");
	}
});

router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		const usersRes = [];
		users.map((user, index) => {
			const { password, ...others } = user._doc;
			usersRes.push(others);
		});
		res.status(200).json(usersRes);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
