const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const User = require("../models/User");
const Link = require("../models/Link");
const authRoute = require("../middleware/authRoute");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", authRoute, (req, res) => {
	res.redirect("/admin/dashboard");
});

router.get("/dashboard", authRoute, async (req, res) => {
	const users = await User.find().sort({ createdAt: "desc" });
	res.render("admin/dashboard", {
		users: users,
		isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
		isAdmin: req.isAdmin,
	});
});

function usernamegenerate(str) {
	return str.split(" ").join("").toLowerCase();
}

function passwordgenerate(str) {
	return str.split(" ").join("").toLowerCase() + "dpsvk";
}

router.post("/dashboard", async (req, res) => {
	token = req.cookies["verify"];
	let adminid = "";

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		adminid = user._id;
	});

	const hashedPass = await bcrypt.hash(passwordgenerate(req.body.name), 10);
	let user = new User({
		name: req.body.name,
		username: usernamegenerate(req.body.name),
		password: hashedPass,
		class: req.body.class,
		adminid: adminid,
	});

	try {
		await user.save();
		return res.redirect("/admin/dashboard");
	} catch (err) {
		console.log(err);
		return res.send("Something went wrong!");
	}
});

router.get("/links", authRoute, async (req, res) => {
	const links = await Link.find().sort({ createdAt: "desc" });
	res.render("admin/link", {
		links: links,
		isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
		isAdmin: req.isAdmin,
	});
});

router.get("/counsellor", authRoute, (req, res) => {
	res.render("admin/counsellor", {
		isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
		isAdmin: req.isAdmin,
	});
});

router.post("/links", async (req, res) => {
	let link = new Link({
		name: req.body.name,
		link: req.body.link,
		date: req.body.date,
	});

	try {
		await link.save();
		return res.redirect("/admin/links");
	} catch (err) {
		console.log(err);
		return res.send("Something went wrong!");
	}
});

module.exports = router;
