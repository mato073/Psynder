const emailService = require("../services/email-service.js");

exports.sendPasswordResetEmail = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}
	const reqOrigin = req.get('origin');
	const sendRes = await emailService.sendPasswordResetEmail(reqOrigin, req.body);
	if (sendRes.success)
		res.status(sendRes.code).send({
			message: "Password reset email sent"
		});
	else
		res.status(sendRes.code).send({
			message: (sendRes.message ? sendRes.message : "Request to send password reset email failed")
		});
};

exports.isResetPwdTokenValid = async function(req, res) {
	const validRes = await emailService.isResetPwdTokenValid(req.query);
	res.status(validRes.code).send();
}