const db = require("../db.js");
const tokenUtils = require("../utils/token-utils.js");
const authorizedProviders = require("../utils/social-auth-utils.js").authorizedProviders;
const emailService = require('./email-service');

// POST
exports.signupUser = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.provider || !json.uid || !json.email || !json.firstName || !json.lastName)
			return ({success: false, message: "Informations are missing"});

		if (typeof(json.uid) !== "string" || typeof(json.provider) !== "string" || typeof(json.email) !== "string" || typeof(json.firstName) !== "string" || typeof(json.lastName) !== "string")
			return ({success: false, message: "Bad type informations"});

		const resGettingDB = await db.get().collection("Users").findOne({"email": json.email});
		if (resGettingDB)
			return ({success: false, message: "Email already used"});

		const resInsertDB = await db.get().collection("Users").insertOne({
				"_id": json.provider + json.uid,
				"email": json.email,
				"password": "",
				"firstName": json.firstName,
				"lastName": json.lastName,
				"phoneNumber": "",
				"potentialDisorders": []
			});

		if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
			return ({success: false, message: "Error when inserting into collection"});
		
		await emailService.sendRegistrationEmail(json.email);
		return ({success: true});
	} catch (exception) {
		let message = exception.message;

		if (exception.message !== "Email already used" && exception.message !== "Bad type informations" && exception.message !== "Informations are missing") {
			const resGettingDB = await db.get().collection("Users").findOne({"email": json.email});
			if (!resGettingDB)
				message += ". Error when fetching user into collection (user may not have been added)";

			const resDeletingDB = await db.get().collection("Users").deleteOne(resGettingDB);
			if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1)
				message += ". Error when removing user into collection (user may not have been added)";
		}
		
		console.log(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		return ({success: false, message: message});
	}
};

exports.signupTherapist = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.provider || !json.uid || !json.email || !json.firstName || !json.lastName)
			return ({success: false, message: "Informations are missing"});

		if (typeof(json.uid) !== "string" || typeof(json.provider) !== "string" || typeof(json.email) !== "string" || typeof(json.firstName) !== "string" || typeof(json.lastName) !== "string")
			return ({success: false, message: "Bad type informations"});

		if (authorizedProviders.indexOf(json.provider) === -1)
			return ({success: false, message: "Incorrect provider"});

		const resGettingDB = await db.get().collection("Therapists").findOne({"email": json.email});
		if (resGettingDB)
			return ({success: false, message: "Email already used"});

		const resInsertDB = await db.get().collection("Therapists").insertOne({
				"_id": json.provider + json.uid,
				"locked": true,
				"email": json.email,
				"password": "",
				"firstName": json.firstName,
				"lastName": json.lastName,
				"phoneNumber": "",
				"specialties": [],
				"alreadyTreated": []
			});

		if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
			return ({success: false, message: "Error when inserting into collection"});
		
		await emailService.sendTherapistRegistrationEmail(json.email);

		if (process.env.runsInDev === "false")
			bot.sendLog(`*${json.lastName.toUpperCase()} ${json.firstName}* created a therapist account with ID *${resInsertDB.insertedId}*`);

		return ({success: true});
	} catch (exception) {
		let message = exception.message;

		if (exception.message !== "Email already used" && exception.message !== "Bad type informations" && exception.message !== "Informations are missing") {
			const resGettingDB = await db.get().collection("Therapists").findOne({"email": json.email});
			if (!resGettingDB)
				message += ". Error when fetching therapist from collection (therapist may not have been added)";

			const resDeletingDB = await db.get().collection("Therapists").deleteOne(resGettingDB);
			if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1)
				message += ". Error when removing therapist from collection (therapist may not have been added)";
		}

		console.log(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		return ({success: false, message: message});
	}
};

// POST
exports.login = async function(json, collectionName, role) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.provider || !json.uid || typeof(json.uid) !== "string")
			return ({success: false, message: "Informations are missing or they're in a wrong type"});

		if (authorizedProviders.indexOf(json.provider) === -1)
			return ({success: false, message: "Incorrect provider"});

		const uid = json.provider + json.uid;
		const resGettingDB = await db.get().collection(collectionName).findOne({_id: uid});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching user from db (probably due to an incorrect uid)"});

		if (role === "therapist" && resGettingDB.locked)
			return ({success: false, message: "Therapist account is locked"});

		const jwtPair = tokenUtils.generateJWTPair(resGettingDB._id, role=role);

		return ({success: true, jwtPair: jwtPair, uid: uid});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};