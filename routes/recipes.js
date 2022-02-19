const router = require("express").Router();
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Comment = require("../models/Comment");

router.post("/", async (req, res) => {
	const newRecipe = new Recipe(req.body);
	try {
		const savedRecipe = await newRecipe.save();
		res.status(200).json(savedRecipe);
	} catch (err) {
		res.status(500).json(err);
	}
});

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

router.get("/:id", async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.id);
		res.status(200).json(recipe);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/", async (req, res) => {
	const username = req.query.user;
	const categoryName = req.query.category;
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
		} else {
			recipes = await Recipe.find();
		}
		res.status(200).json(recipes);
	} catch (err) {
		res.status(500).json(err);
	}
});

// router.post("/:id/comments", (req, res) => {
// 	const comment = new Comment({
// 		author: req.body.username,
// 		comment: req.body.comment,
// 	});
// 	comment.save((err, result) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			Recipe.findById(req.params.id)
// 				.populate("comments")
// 				.exec((err, recipe) => {
// 					if (err) {
// 						console.log(err);
// 					} else {
// 						recipe.comments.push(result);
// 						recipe.save();
// 						console.log(recipe);
// 					}
// 				});
// 		}
// 	});
// });
// router.get("/:id/comments", (req, res) => {
// 	Recipe.findById(req.params.id)
// 		.populate("comments")
// 		.exec((err, recipe) => {
// 			if (err) throw new Error(err);
// 			res.status(200).json(recipe.comments);
// 		});
// });

// //like

// router.post("/:id/like", (req, res) => {
// 	const like = new Like({
// 		liker: currentUser,
// 	});
// 	let isLiked = false;
// 	like.save((err, result) => {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			Recipe.findById(req.params.id)
// 				.populate("likes")
// 				.exec((err, recipe) => {
// 					if (err) {
// 						console.log(err);
// 					} else {
// 						recipe.likes.forEach((item) => {
// 							if (item.liker === result.liker) {
// 								recipe.likes.pull(item);
// 								isLiked = true;
// 							}
// 						});
// 						if (!isLiked) {
// 							recipe.likes.push(result);
// 						}
// 						recipe.save();
// 					}
// 				});
// 		}
// 	});
// });

module.exports = router;
