const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
	author: String,
	comment: String,
});

module.exports = mongoose.model("Comment", CommentSchema);
