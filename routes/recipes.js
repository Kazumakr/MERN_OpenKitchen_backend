const router = require("express").Router();
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
//add new recipe
router.post("/", async (req, res) => {
	const newRecipe = new Recipe(req.body);
	try {
		const savedRecipe = await newRecipe.save();
		res.status(200).json(savedRecipe);
	} catch (err) {
		res.status(500).json(err);
	}
});
//update recipe
router.put("/:id", async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);
		if (recipe.username === req.body.username) {
			try {
				const updatedRecipe = await Recipe.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true }
				);
				res.status(200).json(updatedRecipe);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can update only your recipe");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
//delete recipe
router.delete("/:id", async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);

		if (recipe.username === req.body.username) {
			try {
				await recipe.delete();
				res.status(200).json("Recipe has been deleted");
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can delete only your recipe");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});
//get single recipe
router.get("/:id", async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);
		res.status(200).json(recipe);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get by userId
router.get("/ByUserId/:id", async (req, res) => {
	try {
		const recipe = await Recipe.find({
			userId: mongoose.Types.ObjectId(req.params.id),
		});
		res.status(200).json(recipe);
	} catch (err) {
		res.status(500).json(err);
	}
});
//get recipes by category or user
router.get("/", async (req, res) => {
	const username = req.query.user;
	const categoryName = req.query.category;
	const searchTerm = req.query.search;
	try {
		let recipes;
		if (username) {
			recipes = await Recipe.find({ username });
		} else if (categoryName) {
			recipes = await Recipe.find({
				categories: {
					$in: [categoryName],
				},
			});
		} else if (searchTerm) {
			recipes = await Recipe.find({
				$or: [
					{ title: { $regex: searchTerm, $options: "$i" } },
					{ description: { $regex: searchTerm, $options: "$i" } },
				],
			});
		} else {
			recipes = await Recipe.find();
		}
		res.status(200).json(recipes);
	} catch (err) {
		res.status(500).json(err);
	}
});
//comment
router.put("/:id/comments", (req, res) => {
	const comment = {
		comment: req.body.comment,
		postedByName: req.body.username,
		postedById: req.body.userId,
	};
	Recipe.findByIdAndUpdate(
		req.params.id,
		{
			$push: { comments: comment },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			res.json(result);
		}
	});
});
//like
router.put("/:id/likes", (req, res) => {
	Recipe.findByIdAndUpdate(
		req.params.id,
		{
			$push: { likes: req.body.userId },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			res.json(result);
		}
	});
});
router.put("/:id/unlikes", (req, res) => {
	Recipe.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { likes: req.body.userId },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			return res.status(422).json({ error: err });
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
