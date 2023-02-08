const db = require("../db.js");
const actualId = require("../utils/social-auth-utils.js").actualId;
const ObjectID = require("mongodb").ObjectID;

// create date on client side: new Date(smthg) then date.toISOString()

// POST
// TODO: check that other appointment doesn't already exist at this time
exports.createAppointment = async function(body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body || !body.date || !body.user || !body.therapist)
			return ({success: false, message: "Informations are mising"});

		if (typeof(body.date) !== "string" || typeof(body.user) !== "string" || typeof(body.therapist) !== "string")
			return ({success: false, message: "One or more parameters have the wrong type"});

		const userId = actualId(body.user);
		const userTest = await db.get().collection("Users").findOne({_id: userId});
		if (!userTest)
			return ({success: false, message: "Error when fetching user from collection"});

		const therapistId = actualId(body.therapist);
		const therapistTest = await db.get().collection("Therapists").findOne({_id: therapistId});
		if (!therapistTest)
			return ({success: false, message: "Error when fetching therapist from collection"});

		const date = new Date(body.date);

		const resInsertDB = await db.get().collection("Appointments").insertOne({
			date: date,
			user: body.user, // user ID
			therapist: body.therapist, // therapist ID
			type: ObjectID(body.type) // therapist custom appointment type ID
		});
		if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
			return ({success: false, message: "Error when inserting into collection"});

		const therapistActiveTherapies = therapistTest.activeTherapies ? therapistTest.activeTherapies : null;
		if (therapistActiveTherapies && !therapistActiveTherapies.some(value => { return value.equals(userId); })) {
			therapistActiveTherapies.push(userId);
			const resUpdt = await db.updateField(therapistTest, "Therapists", "activeTherapies", therapistActiveTherapies);
			if (!resUpdt.success)
				return ({success: true, message: `Appointment successfuly created but failed to add user to therapist active therapies list. Error message: ${resUpdt.message}`, appointmentId: resInsertDB.insertedId});
		}

		const userActiveTherapies = userTest.activeTherapies ? userTest.activeTherapies : null;
		if (userActiveTherapies && !userActiveTherapies.some(value => { return value.equals(therapistId); })) {
			userActiveTherapies.push(therapistId);
			const resUpdt = await db.updateField(userTest, "Users", "activeTherapies", userActiveTherapies);
			if (!resUpdt.success)
				return ({success: true, message: `Appointment successfuly created but failed to add therapist to user active therapies list. Error message: ${resUpdt.message}`, appointmentId: resInsertDB.insertedId});
		}

		return ({success: true, appointmentId: resInsertDB.insertedId});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.retrieveAppointmentById = async function(id) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const dbRes = await db.get().collection("Appointments").findOne({_id: actualId(id)});
		if (!dbRes)
			return ({success: false, message: "Error when fetching specialty from the database"});
		const fullTypeOfAppointment = await db.get().collection("AppointmentTypes").findOne({"_id": dbRes.type});
		if (!fullTypeOfAppointment)
			return ({success: false, message: "Error when fetching therapist appointment types"});
		delete fullTypeOfAppointment.ownerId;
		dbRes.type = fullTypeOfAppointment;

		return ({success: true, appointment: dbRes});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.updateAppointmentWithId = async function(id, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body)
			return ({success: false, message: "Informations are missing"});

		const appointment = await db.get().collection("Appointments").findOne({_id: actualId(id)});
		if (!appointment)
			return ({success: false, message: "Error when fetching appointment from database"});

		if (body.date && typeof(body.date) === "string") {
			const date = new Date(body.date);
			if (!date)
				return ({success: false, message: "date should be a string in ISO format"});
		}

		if (body.type && typeof(body.type) != "string")
			return ({success: false, message: "type should be a string"});
	
		const resUpdt = await db.updateManyFields(appointment, "Appointments", 
			{
				date: body.date ? body.date : appointment.date,
				type: body.type ? actualId(body.type) : appointment.type
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
exports.deleteAppointmentWithId = async function(id) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("Appointments").findOne({_id: actualId(id)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching appointment from collection"});

		const resDeletingDB = await db.get().collection("Appointments").deleteOne(resGettingDB);
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when removing appointment from collection"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.listOwnerAppointmentsWithinTimeframe = async function(ownerId, query, ownerCollectionName) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (ownerCollectionName !== "Therapists" && ownerCollectionName !== "Users")
			return ({success: false, message: "Appointments can only be assigned to a user or a therapist"});

		const owner = await db.get().collection(ownerCollectionName).findOne({_id: actualId(ownerId)});
		if (!owner)
			return ({success: false, message: "Error fetching owner from collection"});

		let ownerField = (ownerCollectionName === "Users" ? "user" : "therapist");
		let dbQuery = {};
		dbQuery[ownerField] = actualId(ownerId);

		let timeframeQuery = {};
		if (query.startDate)
			timeframeQuery.$gte = new Date(query.startDate).toISOString();
		if (query.endDate)
			timeframeQuery.$lte = new Date(query.endDate).toISOString();
		if (timeframeQuery.$gte || timeframeQuery.$lte)
			dbQuery.date = timeframeQuery;

		let appointments = await db.get().collection("Appointments").find(dbQuery).toArray();
		const otherOwnerCollectionName = (ownerCollectionName === "Users" ? "Therapists" : "Users");
		const otherOwnerField = (ownerCollectionName === "Users" ? "therapist" : "user");
		for (let i = 0; i < appointments.length; i++) {
			const otherOwner = await db.get().collection(otherOwnerCollectionName).findOne({_id: appointments[i][otherOwnerField]});
			delete otherOwner.password;
			appointments[i][otherOwnerField] = otherOwner;
		}

		if (query.sort) {
			if (query.sort === "ascending")
				appointments.sort((a, b) => {
					let dA = new Date(a.date);
					let dB = new Date(b.date);
					return (dA - dB > 0) ? -1 : 1;
				});
			else if (query.sort === "descending")
				appointments.sort((a, b) => {
					let dA = new Date(a.date);
					let dB = new Date(b.date);
					return (dA - dB > 0) ? 1 : -1;
				});
		}

		return ({success: true, appointments: appointments});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};