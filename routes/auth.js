const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// Signup routes

router.get("/signup", (req, res) => {
	// check if already logged in
	if (req.cookies["verify"] != null) {
		return res.redirect("/");
	}

	res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
	const hashedPass = await bcrypt.hash(req.body.password, 10);
	const admin = new Admin({
		username: req.body.username,
		email: req.body.email,
		password: hashedPass,
		code: req.body.code,
	});
	// check if code matches code provided by school
	if (req.body.code !== process.env.ADMIN_CODE) {
		return res.render("auth/signup", { error: "Invalid code" });
	}
	// const user = await User.findOne({username: req.body.username})
	const emailExists = await Admin.findOne({ email: req.body.email });
	const userExists = await Admin.findOne({ username: req.body.username });
	if (emailExists) {
		// return res.status(400).send('Email already exists');
		return res.render("auth/signup", { error: "Email already exists!" });
	}

	if (userExists) {
		// return res.status(400).send('That username is taken');
		return res.render("auth/signup", { error: "Admin already exists!" });
	}

	try {
		await admin.save();
		res.redirect("/auth/adminLogin");
	} catch (err) {
		console.log(err);
		return res.render("auth/signup", { error: "error" });
	}
});

// Admin Login routes

router.get("/adminLogin", (req, res) => {
	//check if already logged in
	if (req.cookies["verify"] != null) {
		return res.redirect("/");
	}

	res.render("auth/adminLogin");
});

router.post("/adminLogin", async (req, res) => {
	const userExists = await Admin.findOne({ username: req.body.username });
	if (!userExists) {
		return res.render("auth/adminLogin", { error: "User doesn't exist" });
	}

	const user = await Admin.findOne({ username: req.body.username });
	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) {
		return res.render("auth/adminLogin", { error: "Incorrect password" });
	}

	if (req.body.code !== process.env.ADMIN_CODE) {
		return res.render("auth/adminLogin", { error: "Invalid code" });
	}
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	res.cookie("verify", token);
	return res.redirect("/admin/dashboard");
});

// User login routes

router.get("/login", (req, res) => {
	//check if already logged in
	if (req.cookies["verify"] != null) {
		return res.redirect("/");
	}

	res.render("auth/userLogin");
});

router.post("/login", async (req, res) => {
	const userExists = await User.findOne({ username: req.body.username });
	if (!userExists) {
		return res.render("auth/userLogin", { error: "User doesn't exist" });
	}
	// console.log(userExists);

	const user = await User.findOne({ username: req.body.username });
	const validPass = await bcrypt.compare(req.body.password, user.password);
	// console.log(validPass);
	if (!validPass) {
		return res.render("auth/userLogin", { error: "Incorrect password" });
	}
	const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
	res.cookie("verify", token);

	return res.redirect("/user/profile");
});

// Logout Route

router.get("/logout", (req, res) => {
	res.cookie("verify", "", { maxAge: 1 });
	res.redirect("/auth/login");
});

module.exports = router;
