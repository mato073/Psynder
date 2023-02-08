const db = require("../db.js");
const Decimal128 = require("mongodb").Decimal128;
const actualId = require("../utils/social-auth-utils.js").actualId;

// POST
exports.assignLocation = async function(uid, body, ownerCollectionName) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (ownerCollectionName !== "Therapists" && ownerCollectionName !== "Users")
			return ({success: false, message: "Authorized collections are only 'Users' or 'Therapists'"});

		const resGettingDB = await db.get().collection(ownerCollectionName).findOne({_id: actualId(uid)});
		if (!resGettingDB)
		return ({success: false, message: "Error fetching owner from collection"});

		if (!body.lat || !body.lng)
			return ({success: false, message: "lat or lng aruments missing"});

		if (isNaN(parseFloat(body.lat)) || isNaN(parseFloat(body.lng)))
			return ({success: false, message: "lat and lng must be numbers"});

		if (body.formattedAddress && typeof(body.formattedAddress) !== "string")
			return ({success: false, message: "formattedAddress must be a string"});

		const doesLocationExist = await db.get().collection("Locations").findOne({owner: uid, ownerIsTherapist: (ownerCollectionName === "Therapists" ? true : false)});
		if (doesLocationExist)
			return ({success: false, message: "Location already assigned to this user"});

		const dbInsertRes = await db.get().collection("Locations").insertOne({
			"lat": Decimal128.fromString(parseFloat(body.lat).toString()),
			"lng": Decimal128.fromString(parseFloat(body.lng).toString()),
			"formattedAddress": (body.formattedAddress ? body.formattedAddress : ""),
			"owner": uid,
			"ownerIsTherapist": (ownerCollectionName === "Therapists" ? true : false)
		});
		if (!dbInsertRes.result || !dbInsertRes.result.ok || dbInsertRes.result.ok != 1)
			return ({success: false, message: "Error when inserting Location in collection"});

		return ({success: true, locationId: dbInsertRes.insertedId });
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.retrieveLocationById = async function(id) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("Locations").findOne({_id: actualId(id)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching location from collection"});

		return ({success: true, location: JSON.parse(JSON.stringify(resGettingDB))});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.retrieveOwnerLinkedLocation = async function(uid, ownerCollectionName) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (ownerCollectionName !== "Therapists" && ownerCollectionName !== "Users")
			return ({success: false, message: "Authorized collections are only 'Users' or 'Therapists'"});

		const owner = await db.get().collection(ownerCollectionName).findOne({_id: actualId(uid)});
		if (!owner)
			return ({success: false, message: "Owner doesn't exist"});

		const location = await db.get().collection("Locations").findOne({"owner": uid});
		if (!location)
			return ({success: true, message: "No location registered for this user"});

		return ({success: true, location: JSON.parse(JSON.stringify(location))});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.updateLocationWithId = async function(id, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const location = await db.get().collection("Locations").findOne({_id: actualId(id)});
		if (!location)
			return ({success: false, message: "No location registered with this owner"});

		if (body.lat || body.lng) {
			if (!body.lat || !body.lng)
				return ({success: false, message: "In order to update geographic location both lat and lng have to be specified"});
			if (isNaN(parsefloat(body.lat)) || isNaN(parseFloat(body.lng)))
				return ({success: false, message: "lat and lng must be numbers"});

			let resUpdt = await db.updateField(location, "Locations", "lat", Decimal128.fromString(parseFloat(body.lat).toString()));
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});

			resUpdt = await db.updateField(location, "Locations", "lng", Decimal128.fromString(parseFloat(body.lng).toString()));
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.formattedAddress) {
			if (typeof(body.formattedAddress) !== "string")
				return ({success: false, message: "Formatted address must be a string"});
			const resUpdt = await db.updateField(location, "Locations", "formattedAddress", body.formattedAddress);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		return ({success: true, locationId: location._id});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.updateOwnerLinkedLocation = async function(uid, body, ownerCollectionName) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (ownerCollectionName !== "Therapists" && ownerCollectionName !== "Users")
			return ({success: false, message: "Location can only be assigned to a user or a therapist"});

		const owner = await db.get().collection(ownerCollectionName).findOne({_id: actualId(uid)});
		if (!owner)
			return ({success: false, message: "No owner exists with this id"});

		const location = await db.get().collection("Locations").findOne({"owner": uid});
		if (!location)
			return ({success: false, message: "No location registered with this owner"});

		if (body.lat || body.lng) {
			if (!body.lat || !body.lng)
				return ({success: false, message: "In order to update geographic location both lat and lng have to be specified"});

			if (isNaN(parseFloat(body.lat)) || isNaN(parseFloat(body.lng)))
				return ({success: false, message: "lat and lng must be numbers"});

			let resUpdt = await db.updateField(location, "Locations", "lat", Decimal128.fromString(parseFloat(body.lat).toString()));
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});

			resUpdt = await db.updateField(location, "Locations", "lng", Decimal128.fromString(parseFloat(body.lng).toString()));
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.formattedAddress) {
			if (typeof(body.formattedAddress) !== "string")
				return ({success: false, message: "Formatted address must be a string"});

			const resUpdt = await db.updateField(location, "Locations", "formattedAddress", body.formattedAddress);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		return ({success: true, locationId: location._id});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// DELETE
exports.deleteLocationWithId = async function(id) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resDeletingDB = await db.get().collection("Locations").deleteOne({_id: actualId(id)});
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when deleting location from collection"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};