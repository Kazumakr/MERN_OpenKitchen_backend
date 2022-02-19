const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const recipeRoute = require("./routes/recipes");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log("connected to mongoDB"))
	.catch((err) => console.log(err));

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	filename: (req, file, callback) => {
		callback(null, req.body.name);
	},
});

const upload = multer({ storage: storage });
app.post(
	"/api/upload",
	upload.single("file", (req, res) => {
		res.status(200).json("File has been uploaded");
	})
);

app.post("/api/send_mail", cors(), async (req, res) => {
	// let { name } = req.body;
	// let { email } = req.body;
	// let { subject } = req.body;
	// let { text } = req.body;
	let { name, email, subject, text } = req.body;
	const transport = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASS,
		},
	});

	await transport.sendMail({
		from: process.env.MAIL_FROM,
		to: "test@test.com",
		subject: `${subject}`,
		html: `<div className="email" style="
            border:1px solid black;
            padding: 20px;
            font-family:sans-serif;
            line-height:2;
            font-size:20px;
            ">
            <h4>Hi, OPEN KITCHEN</h4>
            <p>${text}</p>
            <p>Thank you.</p>
			<p>${name}</p>
			<p>${email}</p>
            </div>`,
	});
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/recipes", recipeRoute);
app.use("/api/categories", categoryRoute);

app.listen(process.env.PORT || 5000, () => {
	console.log("Server is runnning");
});
