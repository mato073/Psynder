const jwt = require("jsonwebtoken");
const config = require("../../config.json");

// TODO: add support for oauth with passport

exports.isAuthenticated = async(req, res, next) => {
	try {
		if (maintenance.isIn) {
			res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
			return;
		}
		
		const authHeader = req.headers.authorization;
		const accessToken = authHeader && authHeader.split(' ')[1];
		jwt.verify(accessToken, config.accessTokenSecret, function(err, decoded) {
			if (err != null)
				throw Error("Invalid or expired accessToken");
			req.uid = decoded.uid;
			req.role = decoded.role;
		});
		next();
	} catch (err) {
		return res.status(401).json({
			"error": err.message
		});
	}
};