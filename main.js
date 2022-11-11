if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const app = express();
const methodOverride = require("method-override");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbURI = process.env.DB_URL;

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

const PORT = process.env.PORT || 4001;

// Connect to DB
async function connectDB() {
	await mongoose.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		//   useCreateIndex: true,
	});
	await app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}
connectDB();

//App setting
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
	//authRoute add
	res.redirect("/admin"); //change
});
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/auth", authRoute);
