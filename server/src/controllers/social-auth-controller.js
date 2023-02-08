const socialAuthService = require("../services/social-auth.service.js");

// POST
exports.signupUser = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addUserInDB = await socialAuthService.signupUser(req.body);
	const code = (addUserInDB.code ? addUserInDB.code : (addUserInDB.success ? 200 : 400));
	if (addUserInDB.success)
		res.status(code).send({
			message: "User successfuly added"
		});
	else
		res.status(code).send({
			message: (addUserInDB.message ? addUserInDB.message : "Failed to add user")
		});
};

// POST
exports.signupTherapist = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addTherapistInDB = await socialAuthService.signupTherapist(req.body);
	const code = (addTherapistInDB.code ? addTherapistInDB.code : (addTherapistInDB.success ? 200 : 400));
	if (addTherapistInDB.success)
		res.status(code).send({
			message: "Therapist successfuly added"
		});
	else
		res.status(code).send({
			message: (addTherapistInDB.message ? addTherapistInDB.message : "Failed to add therapist")
		});
};


// POST
exports.login = async function(req, res, collectionName, role) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const connectUser = await socialAuthService.login(req.body, collectionName, role);
	const code = (connectUser.code ? connectUser.code : (connectUser.success ? 200 : 400));
	if (connectUser.success)
		res.status(code).send({
			accessToken: connectUser.jwtPair.accessToken,
			refreshToken: connectUser.jwtPair.refreshToken,
			uid: connectUser.uid
		});
	else
		res.status(code).send({
			message: (connectUser.message ? connectUser.message : "Failed to connect user")
		});
};