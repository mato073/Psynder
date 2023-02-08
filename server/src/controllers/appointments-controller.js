const appointmentsService = require("../services/appointments-service.js");

// POST
exports.createAppointment = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const createAppRes = await appointmentsService.createAppointment(req.body);
	const code = (createAppRes.code ? createAppRes.code : (createAppRes.success ? 200 : 400));
	if (createAppRes.success) {
		const objAnswer = { appointmentId: createAppRes.appointmentId };
		if (createAppRes.message)
			objAnswer.message = createAppRes.message;
		res.status(code).send(objAnswer);
	} else
		res.status(code).send({
			message: (createAppRes.message ? createAppRes.message : "Failed to create appointment")
		});
};

// GET
exports.retrieveAppointmentById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const retrieveRes = await appointmentsService.retrieveAppointmentById(req.params.id);
	const code = (retrieveRes.code ? retrieveRes.code : (retrieveRes.success ? 200 : 400));
	if (retrieveRes.success)
		res.status(code).send({
			appointment: retrieveRes.appointment
		});
	else
		res.status(code).send({
			message: (retrieveRes.message ? retrieveRes.message : "Failed to fetch appointment")
		});
};

// PATCH
exports.updateAppointmentWithId = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateRes = await appointmentsService.updateAppointmentWithId(req.params.id, req.body);
	const code = (updateRes.code ? updateRes.code : (updateRes.success ? 200 : 400));
	if (updateRes.success)
		res.status(code).send({
			message: "Appointment successfuly updated"
		});
	else
		res.status(code).send({
			message: (updateRes.message ? updateRes.message : "Failed to update appointment")
		});
};

// DELETE
exports.deleteAppointmentWithId = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteRes = await appointmentsService.deleteAppointmentWithId(req.params.id);
	const code = (deleteRes.code ? deleteRes.code : (deleteRes.success ? 200 : 400));
	if (deleteRes.success)
		res.status(code).send({
			message: "Appointment successfuly deleted"
		});
	else
		res.status(code).send({
			message: (deleteRes.message ? deleteRes.message : "Failed to delete appointment")
		});
};


exports.listOwnerAppointmentsWithinTimeframe = async function(req, res, ownerCollectionName) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const listRes = await appointmentsService.listOwnerAppointmentsWithinTimeframe(req.uid, req.query, ownerCollectionName);
	const code = (listRes.code ? listRes.code : (listRes.success ? 200 : 400));
	if (listRes.success)
		res.status(code).send({
			appointments: listRes.appointments
		});
	else
		res.status(code).send({
			message: (listRes.message ? listRes.message : "Failed to fetch appointment")
		});
};