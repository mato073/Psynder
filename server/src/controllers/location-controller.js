const locationService = require("../services/location-service.js");

// POST
exports.assignLocation = async function(req, res, ownerCollectionName) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const addLocationInDB = await locationService.assignLocation(req.uid, req.body, ownerCollectionName);
	const code = (addLocationInDB.code ? addLocationInDB.code : (addLocationInDB.success ? 200 : 400));
	if (addLocationInDB.success)
		res.status(code).send({
			locationId: addLocationInDB.locationId
		});
	else
		res.status(code).send({
			message: (addLocationInDB.message ? addLocationInDB.message : "Failed to add location")
		});
};


// GET
exports.retrieveLocationById = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const retrieveRes = await locationService.retrieveLocationById(req.params.id);
	const code = (retrieveRes.code ? retrieveRes.code : (retrieveRes.success ? 200 : 400));
	if (retrieveRes.success)
		res.status(code).send({
			location: retrieveRes.location
		});
	else
		res.status(code).send({
			message: (retrieveRes.message ? retrieveRes.message : "Failed to fetch location")
		});
};


// GET
exports.retrieveOwnerLinkedLocation = async function(req, res, ownerCollectionName) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const retrieveRes = await locationService.retrieveOwnerLinkedLocation(req.uid, ownerCollectionName);
	const code = (retrieveRes.code ? retrieveRes.code : (retrieveRes.success ? 200 : 400));
	if (retrieveRes.success) {
		if (retrieveRes.location)
			res.status(code).send({
				location: retrieveRes.location
			});
		else if (retrieveRes.message)
			res.status(204).send();
	} else
		res.status(code).send({
			message: (retrieveRes.message ? retrieveRes.message : "Failed to fetch location")
		});
};


// PATCH
exports.updateLocationWithId = async function(req, res) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateLocationInDB = await locationService.updateLocationWithId(req.params.id, req.body);
	const code = (updateLocationInDB.code ? updateLocationInDB.code : (updateLocationInDB.success ? 200 : 400));
	if (updateLocationInDB.success)
		res.status(code).send({
			locationId: updateLocationInDB.locationId
		});
	else
		res.status(code).send({
			message: (updateLocationInDB.message ? updateLocationInDB.message : "Failed to update location")
		});
};


// PATCH
exports.updateOwnerLinkedLocation = async function(req, res, ownerCollectionName) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const updateLocationInDB = await locationService.updateOwnerLinkedLocation(req.uid, req.body, ownerCollectionName);
	const code = (updateLocationInDB.code ? updateLocationInDB.code : (updateLocationInDB.success ? 200 : 400));
	if (updateLocationInDB.success)
		res.status(code).send({
			locationId: updateLocationInDB.locationId
		});
	else
		res.status(code).send({
			message: (updateLocationInDB.message ? updateLocationInDB.message : "Failed to update location")
		});
};


// DELETE
exports.deleteLocationWithId = async function(req, res, ownerCollectionName) {
	if (maintenance.isIn) {
		res.set({"Retry-After": maintenance.retryAfter}).status(503).send();
		return;
	}

	const deleteLocationInDB = await locationService.deleteLocationWithId(req.params.id);
	const code = (deleteLocationInDB.code ? deleteLocationInDB.code : (deleteLocationInDB.success ? 200 : 400));
	if (deleteLocationInDB.success)
		res.status(code).send();
	else
		res.status(code).send({
			message: (deleteLocationInDB.message ? deleteLocationInDB.message : "Failed to delete location")
		});
};