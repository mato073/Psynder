const appointmentTypesService = require("../services/appointment-types-service.js");

// POST
exports.createAppointmentType = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const createAppTypeRes = await appointmentTypesService.addAppointmentType(req.uid, req.body);
	const code = (createAppTypeRes.code ? createAppTypeRes.code : (createAppTypeRes.success ? 200 : 400));
	if (createAppTypeRes.success)
		res.status(code).send({
			message: "Appointment type successfuly created and added to therapist"
		});
	else
		res.status(code).send({
			message: (createAppTypeRes.message ? createAppTypeRes.message :"Failed to create appointment type")
		});
};

// GET
exports.fetchAppointmentTypeById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const fetchRes = await appointmentTypesService.getAppointmentType(req.uid, req.params.id);
	const code = (fetchRes.code ? fetchRes.code : (fetchRes.success ? 200 : 400));
	if (fetchRes.success)
		res.status(code).send(fetchRes.res);
	else
		res.status(code).send({
			message: (fetchRes.message ? fetchRes.message :"Failed to fetch appointment type")
		});
};


// GET
exports.listAppointmentTypesByUid = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const fetchRes = await appointmentTypesService.listAppointmentTypes(req.uid);
	const code = (fetchRes.code ? fetchRes.code : (fetchRes.success ? 200 : 400));
	if (fetchRes.success)
		res.status(code).send(fetchRes.res);
	else
		res.status(code).send({
			message: (fetchRes.message ? fetchRes.message :"Failed to fetch appointment type")
		});
};


// PATCH
exports.updateAppointmentTypeById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateRes = await appointmentTypesService.editAppointmentType(req.uid, req.params.id, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success)
		res.status(code).send({
			message: "Appointment type successfuly updated"
		});
	else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message :"Failed to update appointment type")
		});
};

// DELETE
exports.deleteAppointmentTypeWithId = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteRes = await appointmentTypesService.removeAppointmentType(req.uid, req.params.id);
	const code = (deleteRes.code ? deleteRes.code : (deleteRes.success ? 200 : 400));
	if (deleteRes.success)
		res.status(code).send({
			message: "Appointment type successfuly deleted"
		});
	else
		res.status(code).send({
			message: (deleteRes.message ? deleteRes.message : "Failed to delete appointment type")
		});
};