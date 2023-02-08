const jwt = require("jsonwebtoken");
const db = require("../db.js");
const bcrypt = require("bcrypt");
const actualId = require("../utils/social-auth-utils.js").actualId;
const mapUtils = require("../utils/maps-utils.js");
const tokenUtils = require("../utils/token-utils.js");
const therapistAvailabilitiesService = require("./therapist-availabilities-service.js");
const locationService = require("./location-service.js");
const appointmentsService = require("./appointments-service");
const emailService = require('./email-service');
const appointementTypsService = require("../services/appointment-types-service.js");

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
exports.signupTherapist = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.password || !json.email || !json.firstName || !json.lastName || !json.phoneNumber)
			return ({success: false, message: "Informations are missing"});

		if (typeof(json.password) !== "string" || typeof(json.email) !== "string" || typeof(json.firstName) !== "string" || typeof(json.lastName) !== "string" || typeof(json.phoneNumber) !== "string")
			return ({success: false, message: "Bad type informations"});

		const resGettingDB = await db.get().collection("Therapists").findOne({"email": json.email});
		if (resGettingDB)
			return ({success: false, message: "Email already used"});

		const res = await bcrypt.hash(json.password, 10).then(async (hash) => {
			if (!hash)
				return ({success: false, message: "Hashing pasword error"});

			const resInsertDB = await db.get().collection("Therapists").insertOne({
				"locked": true,
				"email": json.email,
				"password": hash,
				"firstName": json.firstName,
				"lastName": json.lastName,
				"phoneNumber": json.phoneNumber,
				"specialties": [],
				"alreadyTreated": [],
				"description": "",
				"tags": [],
				"activeTherapies": [],
				"typesOfAppointment": []
			});

			if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
				return ({success: false, message: "Error when inserting into collection"});
			
			await emailService.sendTherapistRegistrationEmail(json.email);

			if (process.env.runsInDev === "false")
				bot.sendLog(`\`${json.lastName.toUpperCase()} ${json.firstName}\` created a therapist account with ID \`${resInsertDB.insertedId}\``);
				
			return ({success: true});
		});

		return res;
	} catch (exception) {
		let message = exception.message;

		if (exception.message !== "Email already used" && exception.message !== "Bad type informations" && exception.message !== "Informations are missing") {
			const resGettingDB = await db.get().collection("Therapists").findOne({"email": json.email});
			if (!resGettingDB)
				message += ". Error when fetching therapist from collection (therapist may not have been added)";

			const resDeletingDB = await db.get().collection("Therapists").deleteOne(resGettingDB);
			if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1)
				message += ". Error when removing therapist into collection (therapist may not have been added)";
		}

		console.log(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${message}\nStack:\n${exception.stack}`);
		return ({success: false, message: message});
	}
};

// POST
exports.loginTherapist = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.password || !json.email)
			return ({success: false, message: "Informations are missing"});

		if (typeof(json.password) !== "string" || typeof(json.email) !== "string")
			return ({success: false, message: "Bad type informations"});

		const resGettingDB = await db.get().collection("Therapists").findOne({"email": json.email});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist from collection"});
		if (resGettingDB.locked)
			return ({success: false, message: "Therapist is locked"});
		const jwtPair = await bcrypt.compare(json.password, resGettingDB.password).then((isValid => {
			if (!isValid)
				return ({success: false, message: "Incorrect password"});
			return ({success: true, res: tokenUtils.generateJWTPair(resGettingDB._id, role="therapist")});
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

// GET
exports.retrieveTherapistById = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getTherapist = await _getTherapistById(uid);
		if (!getTherapist.success)
			return ({success: false, message: "Error when fetching therapist from collection"});
		const therapist = getTherapist.therapist;

		if (therapist.specialties && therapist.specialties.length > 0) {
			for (i = 0; i < therapist.specialties.length; i++) {
				const fullSpecialty = await db.get().collection("Specialties").findOne({"_id": therapist.specialties[i]});
				if (!fullSpecialty)
					return ({success: false, message: "Error when fetching therapist specialty"});
				therapist.specialties[i] = fullSpecialty;
			}
		}

		if (therapist.typesOfAppointment && therapist.typesOfAppointment.length > 0) {
			for (i = 0; i < therapist.typesOfAppointment.length; i++) {
				const fullTypeOfAppointment = await db.get().collection("AppointmentTypes").findOne({"_id": therapist.typesOfAppointment[i]});
				if (!fullTypeOfAppointment)
					return ({success: false, message: "Error when fetching therapist appointment types"});
				delete fullTypeOfAppointment.ownerId;
				therapist.typesOfAppointment[i] = fullTypeOfAppointment;
			}
		}

		delete therapist.password;
		return ({"success": true, "res": therapist});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// DELETE
exports.deleteTherapistById = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getTherapist = await _getTherapistById(uid);
		if (!getTherapist.success)
			return ({success: false, message: "Error when fetching therapist from collection"});
		const therapist = getTherapist.therapist;

		const fetchTherapistAvailabilities = await therapistAvailabilitiesService.getTherapistAvailabilities(uid);
		if (fetchTherapistAvailabilities.success) {
			const resDeletingAvailabilities = await db.get().collection("TherapistAvailabilities").deleteOne({_id: actualId(uid)});
			if (!resDeletingAvailabilities.result || !resDeletingAvailabilities.result.ok || resDeletingAvailabilities.result.ok != 1 || resDeletingAvailabilities.deletedCount !== 1)
				return ({success: false, message: "Error when removing therapist's availabilities from collection"});
		}

		const fetchTherapistLocation = await locationService.retrieveOwnerLinkedLocation(uid, "Therapists");
		if (fetchTherapistLocation.success && fetchTherapistLocation.location) {
			const deleteTherapistLocation = await locationService.deleteLocationWithId(fetchTherapistLocation.location._id);
			if (!deleteTherapistLocation.success)
				return ({success: false, message: deleteTherapistLocation.message});
		}

		const appointments = await db.get().collection("Appointments").find({therapist: uid}).toArray();
		for (let i = 0; i < appointments.length; i++) {
			const resDeleteAppointment = await appointmentsService.deleteAppointmentWithId(`${appointments[i]._id}`);
			if (!resDeleteAppointment.success)
				return ({success: false, message: resDeleteAppointment.message});
		}

		const appointementTypesIds = therapist.typesOfAppointment;
		for (let i = 0; i < appointementTypesIds.length; i++) {
			const resDeleteAppointmentTypes = await appointementTypsService.removeAppointmentType(therapist._id, appointementTypesIds[i]);
			if (!resDeleteAppointmentTypes.success)
				return ({success: false, message: resDeleteAppointmentTypes.message});
		}

		const resDeletingDB = await db.get().collection("Therapists").deleteOne(therapist);
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when removing therapist from collection"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.updateTherapistById = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getTherapist = await _getTherapistById(uid);
		if (!getTherapist.success)
			return ({success: false, message: "Error when fetching therapist from collection"});
		const therapist = getTherapist.therapist;

		if (body.email && typeof(body.email) === "string") {
			const resUpdt = await db.updateField(therapist, "Therapists", "email", body.email);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.phoneNumber && typeof(body.phoneNumber) === "string") {
			const resUpdt = await db.updateField(therapist, "Therapists", "phoneNumber", body.phoneNumber);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.firstName && typeof(body.firstName) === "string") {
			const resUpdt = await db.updateField(therapist, "Therapists", "firstName", body.firstName);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.lastName && typeof(body.lastName) === "string") {
			const resUpdt = await db.updateField(therapist, "Therapists", "lastName", body.lastName);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.description && typeof(body.description) === "string") {
			const resUpdt = await db.updateField(therapist, "Therapists", "description", body.description);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.tags && typeof(body.tags) === "object") {
			if (body.tags.length)
				for (let i = 0; i < body.tags.length; i++)
					if (typeof(body.tags[i]) !== "string")
						return ({success: false, message: "tags should be an array of strings"});
			const resUpdt = await db.updateField(therapist, "Therapists", "tags", body.tags);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		// Will only remove id of user in thrapist's activeTherapies and therapist id in user's activeTherapies
		if (body.activeTherapies && typeof(body.activeTherapies) === "object") {
			if (body.activeTherapies.length)
				for (let i = 0; i < body.activeTherapies.length; i++)
					if (typeof(body.activeTherapies[i]) !== "string")
						return ({success: false, message: "tags should be an array of strings"});

			const newActiveTherapies = therapist.activeTherapies.filter(oldUserId => body.activeTherapies.some(newUserId => { return oldUserId.equals(newUserId); }));
			const resUpdt = await db.updateField(therapist, "Therapists", "activeTherapies", newActiveTherapies);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});

			const usersToRemoveTherapy = therapist.activeTherapies.filter(oldUserId => { return (!body.activeTherapies.some(newUserId => { return oldUserId.equals(newUserId); })); });
			for (let i = 0; i < usersToRemoveTherapy.length; i++) {
				const resRemoveUserActiveTherapy = await _removeActiveTherapyOfUser(usersToRemoveTherapy[i].toString(), therapist._id);
				if (!resRemoveUserActiveTherapy.success)
					return ({success: true, message: resRemoveUserActiveTherapy.message ? resRemoveUserActiveTherapy.message : "Error when removing therapist from user active therapies"});
			}
		}

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

async function _removeActiveTherapyOfUser(userId, therapistId)
{
	try {
		const getUser = await _getUserById(userId);
		if (!getUser.success)
			return ({success: false, message: `Error when fetching user with ID ${userId} from collection${getUser.message ? `: ${getUser.message}` : ""}`});
		const user = getUser.user;

		const newUserActiveTherapies = user.activeTherapies.filter(oldUserId => ![therapistId].some(newUserId => { return oldUserId.equals(newUserId); }));
		const resUpdt = await db.updateField(user, "Users", "activeTherapies", newUserActiveTherapies);
		if (!resUpdt.success)
			return ({success: false, message: resUpdt.message});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

// PATCH
exports.resetTherapistPassword = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const getTherapist = await _getTherapistById(uid);
		if (!getTherapist.success)
			return ({success: false, message: "Error when fetching therapist from collection"});
		const therapist = getTherapist.therapist;

		if (!body.password && typeof(body.password) !== "string")
			return ({success: false, message: "Invalid arguments"});
		const hashRes = await bcrypt.hash(body.password, 10).then(async (hash) => {
			if (!hash)
				return ({success: false, message: "Server error: Failed to hash password"});

			const resUpdt = await db.updateField(therapist, "Therapists", "password", hash);
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

const matchingUserTherapist = require('../algorithms/matching/src/matchingUserTherapist');

_getMatchScoreWithTherapist = async function(userId, therapist) {
	const user = await db.get().collection("Users").findOne({_id: actualId(userId)});
	const resMatch = await matchingUserTherapist(user, therapist);
	if (resMatch.message)
		return 0;
	return resMatch.matchingPercentage;
};

// GET
exports.listTherapistsCloseToUser = async function(uid, query) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const radius = (query.radius) ? query.radius : 60;
		/* fetching user position */
		let userPos = null;
		if (query.lat || query.lng) {
			if (!query.lat || !query.lng)
				return ({success: false, message: "Both lat and lng must be present in query if you specify them"});

			userPos = {
				lat: parseFloat(query.lat),
				lng: parseFloat(query.lng)
			};
		} else {
			const userLocation = await db.get().collection("Locations").findOne({
				"owner": uid,
				"ownerIsTherapist": false
			});

			if (!userLocation)
				return ({success: false, message: "No location found in db for this user"});
	
			userPos = mapUtils.locationToJSONPos(userLocation);
		}

		/* fetching therapist all locations bound to therapists */
		const therapistLocations = await db.get().collection("Locations").find({"ownerIsTherapist": true}).toArray();
		const res = [];
		for (let i = 0; i < therapistLocations.length; i++) {
			therapistPos = mapUtils.locationToJSONPos(therapistLocations[i]);
			const distance = Math.round(mapUtils.getFlightDistanceFromLatLonInKm(
				userPos.lat,
				userPos.lng,
				therapistPos.lat,
				therapistPos.lng) * 100 / 100);

			if (distance < radius) {
				therapist = await db.get().collection("Therapists").findOne({"_id": actualId(therapistLocations[i].owner)});
				therapist.location = therapistPos;
				therapist.distanceInKm = distance;
				therapist.matchingPercentage = await _getMatchScoreWithTherapist(uid, therapist);
				delete therapist.password;
				res.push(therapist);
			}
		}

		return ({success: true, therapists: res});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// POST
exports.addSpecialty = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body.specialty || typeof(body.specialty) !== "string")
			return ({success: false, message: "Missing or bad type of field 'specialty'"});

		const therapist = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!therapist)
			return ({success: false, message: "Error when fetching therapist from collection"});

		if (therapist.specialties.find(x => x.toString() === body.specialty))
			return ({success: false, message: "Specialty already registered for this therapist"});

		const dbRes = await db.get().collection("Therapists").updateOne(therapist, {$push: {specialties: actualId(body.specialty)}});
		if (!dbRes.result || !dbRes.result.ok || dbRes.result.ok != 1)
			return ({success: false, message: "Error when adding specialty to therapist"});

		return ({success: true});
	} catch(exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// DELETE
exports.deleteSpecialty = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body.specialty)
			return ({success: false, message: "Missing field 'specialty'"});

		const therapist = await db.get().collection("Therapists").findOne({_id: actualId(uid), specialties: actualId(body.specialty)});
		if (!therapist)
			return ({success: false, message: "Failed to fetch therapist with matching specialty"});

		const dbRes = await db.get().collection("Therapists").updateOne(
			therapist,
			{$pull: {specialties: actualId(body.specialty)}}
		);
		if (!dbRes.result || !dbRes.result.ok || dbRes.result.ok != 1)
			return ({success: false, message: "Error when deleting specialty to therapist"});

		return ({success: true});
	} catch(exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// POST
exports.addDisorderAlreadyTreated = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body.alreadyTreated || !body.alreadyTreated.name || body.alreadyTreated.cured === undefined)
			return ({success: false, message: "Informations are missing"});

		if (typeof(body.alreadyTreated.name) !== "string" || typeof(body.alreadyTreated.cured) !== "boolean")
			return ({success: false, message: "Bad type informations"});

		const therapist = await db.get().collection("Therapists").findOne({_id: actualId(uid)});
		if (!therapist)
			return ({success: false, message: "Error when fetching therapist from collection"});

		// update disorder already treated
		if (therapist.alreadyTreated.find(x => x.name === body.alreadyTreated.name)) {
			const dbRes = await db.get().collection("Therapists").updateOne(
				{_id: actualId(uid), "alreadyTreated.name": body.alreadyTreated.name},
				{$set: {"alreadyTreated.$.cured": body.alreadyTreated.cured}}
			);
			
			if (!dbRes.result || !dbRes.result.ok || dbRes.result.ok != 1)
				return ({success: false, message: "Error when updating already treated disorder to therapist"});

			return ({success: true});
		}

		// add disorder already treated
		const dbRes = await db.get().collection("Therapists").updateOne(therapist, {$push: {alreadyTreated: body.alreadyTreated}});
		if (!dbRes.result || !dbRes.result.ok || dbRes.result.ok != 1)
			return ({success: false, message: "Error when adding already treated disorder to therapist"});

		return ({success: true});
	} catch(exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// DELETE
exports.deleteDisorderAlreadyTreated = async function(uid, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body.alreadyTreated || !body.alreadyTreated.name)
			return ({success: false, message: "Informations are missing"});

		if (typeof(body.alreadyTreated.name) !== "string")
			return ({success: false, message: "Bad type informations"});

		const therapist = await db.get().collection("Therapists").findOne({_id: actualId(uid), "alreadyTreated.name": body.alreadyTreated.name});
		if (!therapist)
			return ({success: false, message: "Failed to fetch therapist with matching disorder already treated"});

		const dbRes = await db.get().collection("Therapists").updateOne(therapist, {$pull: {alreadyTreated: {name: body.alreadyTreated.name}}});
		if (!dbRes.result || !dbRes.result.ok || dbRes.result.ok != 1)
			return ({success: false, message: "Error when deleting specialty to therapist"});

		return ({success: true});
	} catch(exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};


// GET
exports.fetchPastClients = async function(therapistId, query) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const therapist = await db.get().collection("Therapists").findOne({_id: actualId(therapistId)});
		if (!therapist)
			return ({success: false, message: "Failed to fetch therapist with matching id"});

		let users = [];
		if (!query.search) {
			const currentDate = new Date();
			const lastAppointments = await db.get().collection("Appointments").find({therapist: therapistId, date: {$lte: currentDate}}).limit(3).toArray();

			for (let apt of lastAppointments) {
				const user = await db.get().collection("Users").findOne({_id: actualId(apt.user)});
				delete user.password;
				users.push(user);
			}
		} else {
			const usersFn = await db.get().collection("Users").find({
				$or: [
					{firstName: new RegExp(query.search, "i")},
					{lastname: new RegExp(query.search, "i")}
				]
			}).toArray();

			for (let user of usersFn) {
				const apt = await db.get().collection("Appointments").findOne({therapist: therapistId, user: user._id.toString()});
				if (apt) {
					delete user.password;
					users.push(user);
				}
				if (users.length >= 3)
					break;
			}
		}

		return ({success: true, users: users});
	} catch(exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};
