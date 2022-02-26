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
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [
			{
				comment: String,
				postedByName: String,
				postedById: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
