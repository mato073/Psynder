const db = require("../db.js");
const actualId = require("../utils/social-auth-utils.js").actualId;
const bcrypt = require("bcrypt");
const tokenUtils = require("../utils/token-utils.js");
const emailService = require('./email-service');

// GET
exports.listLockedTherapists = async function(query) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const dbQuery = await db.get().collection("Therapists").find({
			"locked": true
		}).toArray();

		let res = [];
		for (let therapist of dbQuery) {
			delete therapist.password;
			delete therapist.locked;
			delete therapist.alreadyTreated;
			delete therapist.specialties;
			res.push(therapist);
		}

		return ({success: true, therapists: dbQuery});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// TODO: delete therapist by id to be exposed

// PUT
exports.unlockTherapist = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist from collection"});

		const resUpdt = await db.updateField(resGettingDB, "Therapists", "locked", false);
		if (!resUpdt.success)
			return ({success: false, message: resUpdt.message});
		await emailService.sendTherapistAccountEnabledEmail(resGettingDB.email);
		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};