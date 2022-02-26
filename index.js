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
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const path = require("path");

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
//connect to mongoDB
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log("connected to mongoDB"))
	.catch((err) => console.log(err));

//init gfs
let gfs;
const conn = mongoose.connection;
conn.once("open", () => {
	//init stream
	gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: "photos",
	});
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("photos");
});

//storage engine
const storage = new GridFsStorage({
	url: process.env.MONGO_URL,
	options: { useNewUrlParser: true },
	file: (req, file) => {
		const match = ["image/png", "image/jpeg", "image/jpg"];
		if (match.indexOf(file.mimetype) === -1) {
			const filename = `${file.originalname}`;
			return filename;
		}
		return {
			bucketName: "photos",
			filename: `${file.originalname}`,
		};
	},
});

const upload = multer({ storage: storage });

app.post(
	"/api/upload",
	upload.single("file", (req, res) => {
		const imgUrl = `http://localhost:5000/api/file/${req.file.filename}`;
		return res.send(imgUrl);
	})
);

app.get("/api/image/:filename", (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: "No file exist",
			});
		}
		if (
			file.contentType === "image/jpeg" ||
			file.contentType === "image/png" ||
			file.contentType === "image/jpg"
		) {
			const readstream = gridfsBucket.openDownloadStream(file._id);
			readstream.pipe(res);
		} else {
			res.status(404).json({ err: "Not an image" });
		}
	});
});

app.delete("/api/image/:filename", async (req, res) => {
	try {
		await gfs.files.deleteOne({ filename: req.params.filename });
		res.send("success");
	} catch (error) {
		console.log(error);
		res.send("An error occured.");
	}
});

app.post("/api/send_mail", cors(), async (req, res) => {
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
