const db = require("../db.js");
const bcrypt = require("bcrypt");
const actualId = require("../utils/social-auth-utils.js").actualId;
const tokenUtils = require("../utils/token-utils.js");
const potentialDisordersDetection = require("../algorithms/potential_disorders_detection/potential_disorders_detection.js");
const matching = require("../algorithms/matching/matching.js");
const locationService = require("./location-service.js");
const appointmentsService = require("./appointments-service");
const emailService = require('./email-service');

async function _getTherapistById(uid)
{
	try {
		const resGettingDB = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false});

		return ({success: true, therapist: resGettingDB});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function _getUserById(uid)
{
	try {
		const resGettingDB = await db.get().collection("Users").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false});

		return ({success: true, user: resGettingDB});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

// POST
exports.signupUser = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.password || !json.email || !json.firstName || !json.lastName || !json.phoneNumber)
			return ({success: false, message: "Informations are missing"});

		if (typeof(json.password) !== "string" || typeof(json.email) !== "string" || typeof(json.firstName) !== "string" || typeof(json.lastName) !== "string" || typeof(json.phoneNumber) !== "string")
			return ({success: false, message: "Bad type informations"});

		const resGettingDB = await db.get().collection("Users").findOne({"email": json.email});
		if (resGettingDB)
			return ({success: false, message: "Email already used"});

		const res = await bcrypt.hash(json.password, 10).then(async (hash) => {
			if (!hash)
				return ({success: false, message: "Hashing pasword error"});

			const resInsertDB = await db.get().collection("Users").insertOne({
				"email": json.email,
				"emailAuthorized": false,
				"password": hash,
				"firstName": json.firstName,
				"lastName": json.lastName,
				"phoneNumber": json.phoneNumber,
				"potentialDisorders": [],
				"activeTherapies": []
			});

			if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
				return ({success: false, message: "Error when inserting into collection"});
			
			await emailService.sendRegistrationEmail(json.email);
			return ({success: true});
		});


		return res;
	} catch (exception) {
		let message = exception.message;

		if (exception.message !== "Email already used" && exception.message !== "Bad type informations" && exception.message !== "Informations are missing") {
			const resGettingDB = await db.get().collection("Users").findOne({"email": json.email});
			if (!resGettingDB)
				message += ". Error when fetching user from collection (user may not have been added)";

			const resDeletingDB = await db.get().collection("Users").deleteOne(resGettingDB);
			if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1)
				message += ". Error when removing user into collection (user may not have been added)";
		}

		console.log(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		return ({success: false, message: message});
	}
};

// POST
exports.loginUser = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.password || !json.email)
			return ({success: false, message: "Informations are missing"});

		if (typeof(json.password) !== "string" || typeof(json.email) !== "string")
			return ({success: false, message: "Bad type informations"});

		const resGettingDB = await db.get().collection("Users").findOne({"email": json.email});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching user from collection"});

		const jwtPair = await bcrypt.compare(json.password, resGettingDB.password).then((isValid => {
			if (!isValid)
				return ({success: false, message:"Incorrect password"});
			return ({success: true, res: tokenUtils.generateJWTPair(resGettingDB._id, role="user")});
		}));

		if (!jwtPair.success)
			return ({success: false, message: jwtPair.message});
		return ({success: true, jwtPair: jwtPair.res, uid: resGettingDB._id});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// POST
exports.verifyUserEmail  = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.uid)
			return ({success: false, message: "Informations are missing"});

		const getUser = await _getUserById(json.uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;
			
		const resUpdt = await db.updateField(user, "Users", "email", body.email);
		if (!resUpdt.success)
			return ({success: false, message: resUpdt.message});
		return ({success: true, jwtPair: jwtPair.res, uid: user._id});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// GET
exports.retrieveUserById = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getUser = await _getUserById(uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;

		delete user.password;
		return ({success: true, res: JSON.parse(JSON.stringify(user))});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// DELETE
exports.deleteCurrentUser = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getUser = await _getUserById(uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;


		const fetchUserLocation = await locationService.retrieveOwnerLinkedLocation(uid, "Users");
		if (fetchUserLocation.success && fetchUserLocation.location) {
			const deleteUserLocation = await locationService.deleteLocationWithId(fetchUserLocation.location._id);
			if (!deleteUserLocation.success)
				return ({success: false, message: deleteUserLocation.message});
		}

		const appointments = await db.get().collection("Appointments").find({user: uid}).toArray();
		for (let i = 0; i < appointments.length; i++) {
			const resDeleteAppointment = await appointmentsService.deleteAppointmentWithId(`${appointments[i]._id}`);
			if (!resDeleteAppointment.success)
				return ({success: false, message: resDeleteAppointment.message});
		}

		const resDeletingDB = await db.get().collection("Users").deleteOne(user);
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when removing user from collection"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
// can update everything except position and password
exports.updateUserById = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getUser = await _getUserById(uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;

		if (body.email && typeof(body.email) === "string") {
			const resUpdt = await db.updateField(user, "Users", "email", body.email);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.password && typeof(body.password) === "string") {
			const hashRes = await bcrypt.hash(body.password, 10).then(async (hash) => {
				if (!hash)
					return ({success: false});

				const resUpdt = await db.updateField(user, "Users", "password", hash);
				if (!resUpdt.success)
					return ({success: false, message: resUpdt.message});

				return ({success: true});
			});

			if (!hashRes.success)
				return ({success: false, message: (hashRes.message ? hashRes.message : "Password hashing error")});
		}

		if (body.firstName && typeof(body.firstName) === "string") {
			const resUpdt = await db.updateField(user, "Users", "firstName", body.firstName);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.lastName && typeof(body.lastName) === "string") {
			const resUpdt = await db.updateField(user, "Users", "lastName", body.lastName);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.phoneNumber && typeof(body.phoneNumber) === "string") {
			const resUpdt = await db.updateField(user, "Users", "phoneNumber", body.phoneNumber);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.resetUserPassword = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getUser = await _getUserById(uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;

		if (!body.password && typeof(body.password) !== "string")
			return ({success: false, message: "Invalid arguments"});
		const hashRes = await bcrypt.hash(body.password, 10).then(async (hash) => {
			if (!hash)
				return ({success: false, message: "Server error: Failed to hash password"});
			const resUpdt = await db.updateField(user, "Users", "password", hash);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
			return ({success: true});
		});
		if (!hashRes.success)
			return ({success: false, message: (hashRes.message ? hashRes.message : "Password hashing error")});
			return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (!process.env.runsInDev)
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// POST
exports.saveSurveyResults = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getUser = await _getUserById(uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;

		const results = await potentialDisordersDetection(body);
		if (!results.success)
			return ({success: false, message: results.message});

		const oldUsersPotentialDisorders = user.potentialDisorders;
		const userPotentialDisorders = _updateUserPotentialDisorders(oldUsersPotentialDisorders , results.results);
		const resUpdt = await db.updateField({_id: actualId(uid)}, "Users", "potentialDisorders", userPotentialDisorders);
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

function _updateUserPotentialDisorders(disorders, newDisorder)
{
	if (disorders.length < 1)
		return ([newDisorder]);

	for (let i = 0; i < disorders.length; i++) {
		if (disorders[i].name === newDisorder.name) {
			disorders.splice(i, 1, newDisorder);
			return (disorders);
		}
	}
	disorders.push(newDisorder);
	return (disorders);
}

// GET
exports.getMatchingResults = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getUser = await _getUserById(uid);
		if (!getUser.success)
			return ({success: false, message: "Error when fetching user from collection"});
		const user = getUser.user;

		return (await matching(user));
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};