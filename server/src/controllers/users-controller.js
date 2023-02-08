const usersService = require("../services/user-service.js");
const jwt = require("jsonwebtoken");
const config = require("../../config.json");
const redisService = require("../services/redis-service");


// POST
exports.signup = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addUserInDB = await usersService.signupUser(req.body);
	const code = (addUserInDB.code ? addUserInDB.code : (addUserInDB.success ? 200 : 400));
	if (addUserInDB.success)
		res.status(code).send({
			message: "User successfuly added"
		});
	else
		res.status(code).send({
			message: (addUserInDB.message ? addUserInDB.message : "Fail to add user")
		});
};

// POST
exports.login = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const connectUser = await usersService.loginUser(req.body);
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

// GET
exports.retrieveCurrentUser = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const currentUser = await usersService.retrieveUserById(req.uid);
	const code = (currentUser.code ? currentUser.code : (currentUser.success ? 200 : 400));
	if (currentUser.success)
		res.status(code).send({
			user: currentUser.res
		});
	else
		res.status(code).send({
			message: (currentUser.message ? currentUser.message : "Failed to fetch user from db")
		});
};

// GET
exports.retrieveUserById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const currentUser = await usersService.retrieveUserById(req.params.id);
	const code = (currentUser.code ? currentUser.code : (currentUser.success ? 200 : 400));
	if (currentUser.success)
		res.status(code).send({
			user: currentUser.res
		});
	else
		res.status(code).send({
			message: (currentUser.message ? currentUser.message : "Failed to fetch user from db")
		});
};

// DELETE
exports.deleteCurrentUser = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteUserInDB = await usersService.deleteCurrentUser(req.uid);
	const code = (deleteUserInDB.code ? deleteUserInDB.code : (deleteUserInDB.success ? 200 : 400));
	if (deleteUserInDB.success)
		res.status(code).send({
			message: "User successfuly deleted"
		});
	else
		res.status(code).send({
			message: (deleteUserInDB.message ? deleteUserInDB.message : "Failed to delete user")
		});
};


// PATCH
exports.updateCurrentUser = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateRes = await usersService.updateUserById(req.uid, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success)
		res.status(code).send({
			message: "User successfuly updated"
		});
	else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Failed to update user")
		});
};

// PATCH
exports.resetUserPassword = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];
	let uid;
	try {
		jwt.verify(token, config.accessTokenSecret, function(err, decoded) {
			if (err != null)
				throw Error("Invalid token");
			uid = decoded.uid;
		});
		const storedToken = await redisService.getCachedUserLinkedToken(uid, 'password_reset');
		if (!storedToken || storedToken !== token)
			throw Error("Expired token");
			
	} catch(e) {
		res.status(400).send({message: e.stack});
		return;
	}
	const updateRes = await usersService.resetUserPassword(uid, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success) {
		redisService.destroyKey(uid + '_password_reset');
		res.status(code).send({
			message: "Password successfuly updated"
		});
	} else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Failed to update user")
		});
};

// POST
exports.saveSurveyResults = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const saveSurveyResults = await usersService.saveSurveyResults(req.uid, req.body);
	const code = (saveSurveyResults.code ? saveSurveyResults.code : (saveSurveyResults.success ? 200 : 400));
	if (saveSurveyResults.success)
		res.status(code).send({
			message: "Results successfuly stored"
		});
	else
		res.status(code).send({
			message: (saveSurveyResults.message ? saveSurveyResults.message : "Fail to save results of the disorders detection algorithm")
	});
};

// GET
exports.getMatchingResults = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const matchingResults = await usersService.getMatchingResults(req.uid);
	const code = (matchingResults.code ? matchingResults.code : (matchingResults.success ? 200 : 400));
	if (matchingResults.success)
		res.status(code).send({
			results: matchingResults.results
		});
	else
		res.status(code).send({
			message: (matchingResults.message ? matchingResults.message : "Fail get results of a matching between the user and therapists")
	});
};
