const jwt = require("jsonwebtoken");
const tokenUtils = require("../utils/token-utils.js");
const config = require("../../config.json");


// TODO: logout route to remove token from whitelist

// POST
exports.refreshJWTPair = async function(refreshToken) {
	try {
		let pair = {};
		return jwt.verify(refreshToken, config.refreshTokenSecret, function(err, decoded) {
			if (err || !(decoded.uid) || !decoded.role)
				return ({success: false, message: "Invalid or expired refreshToken"});

			try {
				pair = tokenUtils.generateJWTPair(decoded.uid, role = decoded.role, oldRefreshToken = refreshToken);
			} catch (error) {
				throw error;
			}

			return ({success: true, res: pair});
		});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};
