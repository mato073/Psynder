const therapistsAvailabilitiesService = require("../services/therapist-availabilities-service.js");

// GET
exports.getAvailabilities = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const getTherapistAvailabilitiesInDB = await therapistsAvailabilitiesService.getTherapistAvailabilities(req.uid);
	const code = (getTherapistAvailabilitiesInDB.code ? getTherapistAvailabilitiesInDB.code : (getTherapistAvailabilitiesInDB.success ? 200 : 400));
	if (getTherapistAvailabilitiesInDB.success)
		res.status(code).send(getTherapistAvailabilitiesInDB.res);
	else
		res.status(code).send({
			message: (getTherapistAvailabilitiesInDB.message ? getTherapistAvailabilitiesInDB.message : "Fail to get therapist's availabilities")
		});
};

// POST
exports.addAvailabilities = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addTherapistAvailabilitiesInDB = await therapistsAvailabilitiesService.registerTherapistAvailabilities(req.uid, req.body);
	const code = (addTherapistAvailabilitiesInDB.code ? addTherapistAvailabilitiesInDB.code : (addTherapistAvailabilitiesInDB.success ? 200 : 400));
	if (addTherapistAvailabilitiesInDB.success)
		res.status(code).send({
			message: "Therapist availabilities successfuly added"
		});
	else
		res.status(code).send({
			message: (addTherapistAvailabilitiesInDB.message ? addTherapistAvailabilitiesInDB.message : "Fail to add therapist's availabilities")
		});
};

// PATCH
exports.updateAvailabilities = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateTherapistAvailabilitiesInDB = await therapistsAvailabilitiesService.updateTherapistAvailabilities(req.uid, req.body);
	const code = (updateTherapistAvailabilitiesInDB.code ? updateTherapistAvailabilitiesInDB.code : (updateTherapistAvailabilitiesInDB.success ? 200 : 400));
	if (updateTherapistAvailabilitiesInDB.success)
		res.status(code).send({
			message: "Therapist availabilities successfuly updated"
		});
	else
		res.status(code).send({
			message: (updateTherapistAvailabilitiesInDB.message ? updateTherapistAvailabilitiesInDB.message : "Fail to update therapist's availabilities")
		});
};

// GET
exports.getCurrentAvailabilities = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const getCurrentTherapistAvailabilities = await therapistsAvailabilitiesService.getCurrentAvailabilities(req.uid, req.query);
	const code = (getCurrentTherapistAvailabilities.code ? getCurrentTherapistAvailabilities.code : (getCurrentTherapistAvailabilities.success ? 200 : 400));
	if (getCurrentTherapistAvailabilities.success)
		res.status(code).send({
			availabilities: getCurrentTherapistAvailabilities.res
		});
	else
		res.status(code).send({
			message: (getCurrentTherapistAvailabilities.message ? getCurrentTherapistAvailabilities.message : "Fail to fetch current therapist's availabilities")
		});
};

// GET
exports.getTherapistAvailabilities = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const getCurrentTherapistAvailabilities = await therapistsAvailabilitiesService.getCurrentAvailabilities(req.params.id, req.query);
	const code = (getCurrentTherapistAvailabilities.code ? getCurrentTherapistAvailabilities.code : (getCurrentTherapistAvailabilities.success ? 200 : 400));
	if (getCurrentTherapistAvailabilities.success)
		res.status(code).send({
			availabilities: getCurrentTherapistAvailabilities.res
		});
	else
		res.status(code).send({
			message: (getCurrentTherapistAvailabilities.message ? getCurrentTherapistAvailabilities.message : "Fail to fetch current therapist's availabilities")
		});
};