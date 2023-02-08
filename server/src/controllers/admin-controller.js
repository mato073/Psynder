const adminService = require("../services/admin-service.js");
const therapistsService = require("../services/therapists-service.js");

// GET
exports.listLockedTherapists = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}
	const lockedTherapists = await adminService.listLockedTherapists(req.query);
	const code = (lockedTherapists.code ? lockedTherapists.code : (lockedTherapists.success ? 200 : 400));
	if (lockedTherapists.success)
		res.status(code).send({
			therapists: lockedTherapists.therapists
		});
	else
		res.status(code).send({
			message: (lockedTherapists.message ? lockedTherapists.message : "Failed to unlock user")
		});
};

// PUT
exports.unlock = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}
	const unlockTherapist = await adminService.unlockTherapist(req.params.id);
	const code = (unlockTherapist.code ? unlockTherapist.code : (unlockTherapist.success ? 200 : 400));
	if (unlockTherapist.success)
		res.status(code).send({
			message: "Admin successfully unlocked"
		});
	else
		res.status(code).send({
			message: (unlockTherapist.message ? unlockTherapist.message : "Failed to unlock user")
		});
};


// DELETE
exports.deleteTherapistById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteTherapistInDB = await therapistsService.deleteTherapistById(req.params.id);
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