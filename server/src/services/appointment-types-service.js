const db = require("../db.js");
const actualId = require("../utils/social-auth-utils.js").actualId;

// POST
exports.addAppointmentType = async function(uid, body)
{
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body || !body.name || !body.duration)
			return ({success: false, message: "Informations are missing"});

		if (typeof(body.name) !== "string" || typeof(body.duration) !== "string")
			return ({success: false, message: "Bad type informations"});

		if (!body.duration.match(/^[0-2][0-9]:[0-5][0-9]$/i))
			return ({success: false, message: "Duration should match the format HH:MM"});

		if (body.description && typeof(body.description) !== "string")
			return ({success: false, message: "description should be a string"});

		if (body.color && (typeof(body.color) !== "string" || !body.color.match(/^#[0-9a-f]{6,8}$/i)))
			return ({success: false, message: "color should be a string and starts with '#'"});

		const resGettingDB = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist from collection"});

		const resTryGettingAlreadyExistingType = await db.get().collection("AppointmentTypes").findOne({ownerId: actualId(uid), name: body.name});
		if (resTryGettingAlreadyExistingType)
			return ({success: false, message: "An appointment type already exist with this name for this therapist"});

		const resInsertDB = await db.get().collection("AppointmentTypes").insertOne({
			ownerId: uid,
			name: body.name,
			duration: body.duration,
			color: body.color,
			description: body.description ? body.description : ''
		});

		if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
			return ({success: false, message: "Error when inserting into collection"});

		if (resGettingDB.typesOfAppointment && resGettingDB.typesOfAppointment.length > 0 && resGettingDB.typesOfAppointment.includes(resInsertDB.insertedId))
			return ({success: false, message: "ID of the inserted appointment type already exists in the therapist appointmentTypes field"});

		const newTypesOfAppointment = resGettingDB.typesOfAppointment ? resGettingDB.typesOfAppointment : [];
		newTypesOfAppointment.push(resInsertDB.insertedId);
		const resUpdt = await db.updateField(resGettingDB, "Therapists", "typesOfAppointment", newTypesOfAppointment);
		if (!resUpdt.success)
			return ({success: false, message: resUpdt.message});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.editAppointmentType = async function(uid, id, body)
{
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body)
			return ({success: false, message: "Informations are missing"});

		if (body.name && typeof(body.name) !== "string")
			return ({success: false, message: "name should be a string"});

		if (body.duration && (typeof(body.duration) !== "string" || !body.duration.match(/^[0-2][0-9]:[0-5][0-9]$/i)))
			return ({success: false, message: "duration should be a string and match the format HH:MM"});

		if (body.description && typeof(body.description) !== "string")
			return ({success: false, message: "description should be a string"});

		if (body.color && (typeof(body.color) !== "string" || !body.color.match(/^#[0-9a-f]{6,8}$/i)))
			return ({success: false, message: "color should be a string and starts with '#'"});

		const resGettingDB = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist from collection"});

		const resGettingAlreadyExistingType = await db.get().collection("AppointmentTypes").findOne({_id: actualId(id)});
		if (!resGettingAlreadyExistingType)
			return ({success: false, message: "Error when fetching appointment type in collection, ID may not exists"});

		if (resGettingAlreadyExistingType.ownerId != uid)
			return ({success: false, message: "Error when fetching appointment type in collection because therapist uid isn't the appointment type owner", code: 403});

		const resUpdt = await db.updateManyFields(resGettingAlreadyExistingType, "AppointmentTypes", 
			{
				name: body.name ? body.name : resGettingAlreadyExistingType.name,
				duration: body.duration ? body.duration : resGettingAlreadyExistingType.duration,
				color: body.color ? body.color : resGettingAlreadyExistingType.color,
				description: body.description ? body.description : ''
			}
		);
		if (!resUpdt.success)
			return ({success: false, message: resUpdt.message});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// DELETE
exports.removeAppointmentType = async function(uid, id)
{
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist from collection"});

		const resGettingAlreadyExistingType = await db.get().collection("AppointmentTypes").findOne({_id: actualId(id)});
		if (!resGettingAlreadyExistingType)
			return ({success: false, message: "Error when fetching appointment type in collection, ID may not exists"});

		if (resGettingAlreadyExistingType.ownerId != uid)
			return ({success: false, message: "Error when fetching appointment type in collection because therapist uid isn't the appointment type owner", code: 403});

		const resDeletingDB = await db.get().collection("AppointmentTypes").deleteOne(resGettingAlreadyExistingType);
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when removing appointment type from collection"});

		const newTypesOfAppointment = resGettingDB.typesOfAppointment;
		newTypesOfAppointment.splice(newTypesOfAppointment.indexOf(id), 1);
		const resUpdt = await db.updateField(resGettingDB, "Therapists", "typesOfAppointment", newTypesOfAppointment);
		if (!resUpdt.success)
			return ({success: false, message: resUpdt.message});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.getAppointmentType = async function(uid, id)
{
	try {
		const resGettingDB = await db.get().collection("AppointmentTypes").findOne({_id: actualId(id)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching appointment type in collection, ID may not exists"});

		if (resGettingDB.ownerId != uid)
			return ({success: false, message: "Error when fetching appointment type in collection because therapist uid isn't the appointment type owner", code: 403});

		return ({success: true, res: resGettingDB});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.exception.message});
	}
};

// GET
exports.listAppointmentTypes = async function(uid)
{
	try {
		const resGettingDB = await db.get().collection("AppointmentTypes").find({ownerId: uid}).toArray();
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching appointment types in collection, none may be linked to user id"});

		return ({success: true, res: resGettingDB});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.exception.message});
	}
};