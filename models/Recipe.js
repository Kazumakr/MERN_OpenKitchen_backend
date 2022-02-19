const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		photo: {
			type: String,
			required: false,
		},
		username: {
			type: String,
			required: true,
		},
		categories: {
			type: Array,
		},

		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
