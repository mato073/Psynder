const therapistsService = require("../services/therapists-service.js");
const jwt = require("jsonwebtoken");
const config = require("../../config.json");
const redisService = require("../services/redis-service");

// POST
exports.signup = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addTherapistInDB = await therapistsService.signupTherapist(req.body);
	const code = (addTherapistInDB.code ? addTherapistInDB.code : (addTherapistInDB.success ? 200 : 400));
	if (addTherapistInDB.success)
		res.status(code).send({
				message: "Therapist successfuly added"
		});
	else
		res.status(code).send({
			message: (addTherapistInDB.message ? addTherapistInDB.message : "Fail to add therapist")
		});
};

// POST
exports.login = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const connectTherapist = await therapistsService.loginTherapist(req.body);
	const code = (connectTherapist.code ? connectTherapist.code : (connectTherapist.success ? 200 : 400));
	if (connectTherapist.success)
		res.status(code).send({
			accessToken: connectTherapist.jwtPair.accessToken,
			refreshToken: connectTherapist.jwtPair.refreshToken,
			uid: connectTherapist.uid
		});
	else
		res.status(code).send({
			message: (connectTherapist.message ? connectTherapist.message : "Failed to connect therapist")
		});
};

// GET
exports.retrieveCurrentTherapist = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const currentTherapist = await therapistsService.retrieveTherapistById(req.uid);
	const code = (currentTherapist.code ? currentTherapist.code : (currentTherapist.success ? 200 : 400));
	if (currentTherapist.success)
		res.status(code).send({
			therapist: currentTherapist.res
		});
	else
		res.status(code).send({
			message: (currentTherapist.message ? currentTherapist.message : "Failed to fetch therapist from db")
		});
};

// GET
exports.retrieveTherapistById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const currentTherapist = await therapistsService.retrieveTherapistById(req.params.id);
	const code = (currentTherapist.code ? currentTherapist.code : (currentTherapist.success ? 200 : 400));
	if (currentTherapist.success)
		res.status(code).send({
			therapist: currentTherapist.res
		});
	else
		res.status(code).send({
			message: (currentTherapist.message ? currentTherapist.message : "Failed to fetch therapist from db")
		});
};

// DELETE
exports.deleteCurrentTherapist = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteTherapistInDB = await therapistsService.deleteTherapistById(req.uid);
	const code = (deleteTherapistInDB.code ? deleteTherapistInDB.code : (deleteTherapistInDB.success ? 200 : 400));
	if (deleteTherapistInDB.success)
		res.status(code).send({
				message: "Therapist successfuly deleted"
		});
	else
		res.status(code).send({
			message: (deleteTherapistInDB.message ? deleteTherapistInDB.message : "Failed to delete therapist")
		});
};


// PATCH
exports.updateCurrentTherapist = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateRes = await therapistsService.updateTherapistById(req.uid, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success)
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Therapist successfuly updated")
		});
	else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Failed to update therapist")
		});
};

// PATCH
exports.resetTherapistPassword = async function(req, res) {
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
	const updateRes = await therapistsService.resetTherapistPassword(uid, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success) {
		redisService.destroyKey(uid + '_password_reset');
		res.status(code).send({
			message: "Password successfuly updated"
		});
	} else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Failed to update therapist")
		});
};


// GET
exports.listTherapistsCloseToUser = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const listRes = await therapistsService.listTherapistsCloseToUser(req.uid, req.query);
	const code = (listRes.code ? listRes.code : (listRes.success ? 200 : 400));
	if (listRes.success)
		res.status(code).send({
			therapists: JSON.stringify(listRes.therapists)
		});
	else
		res.status(code).send({
			message: (listRes.message ? listRes.message : "Failed to fetch therapist from db")
		});
};


// POST
exports.addSpecialty = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addRes = await therapistsService.addSpecialty(req.uid, req.body);
	const code = (addRes.code ? addRes.code : (addRes.success ? 200 : 400));
	if (addRes.success)
		res.status(code).send({
			message: "Specialty successfuly added to therapist"
		});
	else
		res.status(code).send({
			message: (addRes.message ? addRes.message : "Failed to add specialty to therapist")
		});
};

// DELETE
exports.deleteSpecialty = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteTherapistInDB = await therapistsService.deleteSpecialty(req.uid, req.query);
	const code = (deleteTherapistInDB.code ? deleteTherapistInDB.code : (deleteTherapistInDB.success ? 200 : 400));
	if (deleteTherapistInDB.success)
		res.status(code).send({
			message: "Specialty successfuly removed from therapist"
		});
	else
		res.status(code).send({
			message: (deleteTherapistInDB.message ? deleteTherapistInDB.message : "Failed to delete specialty from therapist")
		});
};

// POST
exports.addDisorderAlreadyTreated = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addRes = await therapistsService.addDisorderAlreadyTreated(req.uid, req.body);
	const code = (addRes.code ? addRes.code : (addRes.success ? 200 : 400));
	if (addRes.success)
		res.status(code).send({
			message: "Disorder already treated successfuly added/updated in therapist"
		});
	else
		res.status(code).send({
			message: (addRes.message ? addRes.message : "Failed to add specialty to therapist")
		});
};

// DELETE
exports.deleteDisorderAlreadyTreated = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteTherapistInDB = await therapistsService.deleteDisorderAlreadyTreated(req.uid, req.body);
	const code = (deleteTherapistInDB.code ? deleteTherapistInDB.code : (deleteTherapistInDB.success ? 200 : 400));
	if (deleteTherapistInDB.success)
		res.status(code).send({
			message: "Disorder already treated successfuly removed from therapist"
		});
	else
		res.status(code).send({
			message: (deleteTherapistInDB.message ? deleteTherapistInDB.message : "Failed to delete specialty from therapist")
		});
};


// GET
exports.listPastClients = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const listRes = await therapistsService.fetchPastClients(req.uid, req.query);
	const code = (listRes.code ? listRes.code : (listRes.success ? 200 : 400));
	if (listRes.success)
		res.status(code).send({
			"clients": JSON.stringify(listRes.users)
		});
	else
		res.status(code).send({
			message: (listRes.message ? listRes.message : "Failed to fetch clients.")
		});
};