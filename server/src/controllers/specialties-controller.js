const specialtiesService = require("../services/specialties-service.js");

// POST
exports.addSpecialty = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addSpecialtyInDB = await specialtiesService.addSpecialty(req.body);
	const code = (addSpecialtyInDB.code ? addSpecialtyInDB.code : (addSpecialtyInDB.success ? 200 : 400));
	if (addSpecialtyInDB.success)
		res.status(code).send({
			specialtyId: addSpecialtyInDB.specialtyId
		});
	else
		res.status(code).send({
			message: (addSpecialtyInDB.message ? addSpecialtyInDB.message : "Failed to add specialty")
		});
};


// GET
exports.listSpecialties = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const listSpeRes = await specialtiesService.listSpecialties();
	const code = (listSpeRes.code ? listSpeRes.code : (listSpeRes.success ? 200 : 400));
	if (listSpeRes.success)
		res.status(code).send({
			specialties: listSpeRes.specialties
		});
	else
		res.status(code).send({
			message: (listSpeRes.message ? listSpeRes.message : "Failed to get specialties")
		});
};

// GET
exports.retrieveSpecialtyById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const id = req.params.id;
	const retrieveSpeRes = await specialtiesService.retrieveSpecialtyById(id);
	const code = (retrieveSpeRes.code ? retrieveSpeRes.code : (retrieveSpeRes.success ? 200 : 400));
	if (retrieveSpeRes.success)
		res.status(code).send({
			specialty:retrieveSpeRes.specialty
		});
	else
		res.status(code).send({
			message: (retrieveSpeRes.message ? retrieveSpeRes.message : "Failed to get specialty")
		});
};

// PATCH
exports.updateSpecialtyWithId = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateRes = await specialtiesService.updateSpecialtyWithId(req.params.id, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success)
		res.status(code).send({
			message: "Specialty successfuly updated"
		});
	else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Failed to update specialty")
		});
};

// DELETE
exports.deleteSpecialtyWithId = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteRes = await specialtiesService.deleteSpecialtyWithId(req.params.id);
	const code = (deleteRes.code ? deleteRes.code : (deleteRes.success ? 200 : 400));
	if (deleteRes.success)
		res.status(code).send();
	else
		res.status(code).send({
			message: (deleteRes.message ? deleteRes.message : "Failed to delete specialty")
		});
};
