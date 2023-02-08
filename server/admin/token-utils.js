const jwt = require("jsonwebtoken");
const config = require("../config.json");

exports.generateJWTPair = function(uid, role="user", oldRefreshToken=null) {
	const existingRoles = ["user", "therapist", "admin"];
	if (!existingRoles.includes(role))
		throw Error("role specified is invalid");
	const accessToken = jwt.sign({ uid: uid, role: role }, config.accessTokenSecret, {expiresIn: "30m"});
	const refreshToken = jwt.sign({ uid: uid, role: role }, config.refreshTokenSecret, {expiresIn: "2d"});
	return {
		accessToken: accessToken,
		refreshToken: refreshToken
	};
};

// TODO: store all EXPIRED refresh tokens in REDIS whitelist
// --> if user logs out and refresh token is compromised, the account is still secure
