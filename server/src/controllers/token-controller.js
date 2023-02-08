const tokenService = require("../services/token-service.js");

// POST
exports.refreshJWTPair = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const refreshRes = await tokenService.refreshJWTPair(req.body.refreshToken);
	const code = (refreshRes.code ? refreshRes.code : (refreshRes.success ? 200 : 400));
	if (refreshRes.success)
		res.status(code).send(refreshRes.res);
	else
		res.status(code).send({
			message: (refreshRes.message ? refreshRes.message : "Failed to refresh token pair")
		});
};