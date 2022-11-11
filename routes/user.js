const express = require("express");
const router = express.Router();
const authRoute = require("../middleware/authRoute");
const User = require("../models/User");
const Link = require("../models/Link");
const jwt = require("jsonwebtoken");

router.get("/", authRoute, (req, res) => {
	res.redirect("/user/profile", {
		isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
		isAdmin: req.isAdmin,
	});
});

router.get("/profile", authRoute, async (req, res) => {
	//not working
	token = req.cookies["verify"];
	var userid = "";

	await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		userid = user._id;
	});

	let user = await User.findById(userid);

	try {
		res.render("user/profile", {
			user: user,
			isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
			isAdmin: req.isAdmin,
		});
	} catch (err) {
		console.log(err);
	}
});
router.get("/profile/:id", authRoute, async (req, res) => {
	let user = await User.findById(req.params.id);

	try {
		res.render("user/profiles", {
			user: user,
			isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
			isAdmin: req.isAdmin,
		});
	} catch (err) {
		console.log(err);
	}
});

router.get("/counsellor", authRoute, (req, res) => {
	res.render("user/counsellor", {
		isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
		isAdmin: req.isAdmin,
	});
});

router.get("/links", authRoute, async (req, res) => {
	const links = await Link.find().sort({ createdAt: "desc" });
	res.render("user/link", {
		links: links,
		isLoggedIn: Object.keys(req.user).length === 0 ? false : true,
		isAdmin: req.isAdmin,
	});
});

module.exports = router;
