const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const Admin = require("../models/Admin");
const User = require("../models/User");

module.exports = async (req, res, next) => {
	const token = req.cookies.verify;
	if (!token) {
		return res.redirect("/auth/login");
	}
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		let admin = await Admin.findById(verified._id);
		req.isAdmin = admin ? true : false;
	} catch (err) {
		console.log(err);
		res.status(400);
	}
	next();
};
