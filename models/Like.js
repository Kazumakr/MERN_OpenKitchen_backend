const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
	like: {
		type: String,
	},
});

module.exports = mongoose.model("Like", LikeSchema);
