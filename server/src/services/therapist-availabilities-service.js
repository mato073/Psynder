const db = require("../db.js");
const actualId = require("../utils/social-auth-utils.js").actualId;
const timeSlotsParsing = require("../utils/therapist-availabilities/timeSlots-parsing.js");
const getOnlyGoodInformationsFromBody = require("../utils/therapist-availabilities/getOnlyGoodInformationsFromBody.js");
const appointmentsService = require("../services/appointments-service.js");
const currentAvailabilities = require("../utils/therapist-availabilities/currentAvailabilities.js");

// GET
exports.getTherapistAvailabilities = async function(uid) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resGettingDB = await db.get().collection("TherapistAvailabilities").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist's availabilities from collection. Please check if they have already been defined or not"});

		delete resGettingDB._id;
		return ({success: true, res: resGettingDB});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// POST
exports.registerTherapistAvailabilities = async function(uid, json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.days)
			return ({success: false, message: "Informations are missing"});

		const resGettingDB = await db.get().collection("TherapistAvailabilities").findOne({_id: actualId(uid)});
		if (resGettingDB)
			return ({success: false, message: "Availabilities of therapists already defined"});

		const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
		for (let i = 0; i < json.days.length; i++) {
			if (!json.days[i].day || !json.days[i].timeSlots)
				return ({success: false, message: "Informations are missing"});
			if (typeof(json.days[i].day) !== "string" || typeof(json.days[i].timeSlots) !== "object")
				return ({success: false, message: "Bad type informations in a 'days' occurence"});
			if (!validDays.includes(json.days[i].day))
				return ({success: false, message: `'${json.days[i].day}' isn't a valid day name`});

			const timeSlots = json.days[i].timeSlots;
			const timeSlotsParsingResults = timeSlotsParsing(json.days[i].day, timeSlots);
			if (!timeSlotsParsingResults.success)
				return ({success: false, message: timeSlotsParsingResults.message});
		}

		for (let j = 0; j < json.days.length; j++) {
			for (let k = 0; k < json.days.length; k++) {
				if (k === j)
					continue;
				if (json.days[k].day === json.days[j].day)
					return ({success: false, message: `'${json.days[k].day}' is already defined in list of days`});
			}
		}

		const availabilities = getOnlyGoodInformationsFromBody(json);
		const definedDays = currentAvailabilities.getDefinedDays(availabilities);
		for (let i = 0; i < validDays.length; i++)
			if (!definedDays.includes(validDays[i]))
				availabilities.push({day: validDays[i], timeSlots: []});

		const resInsertDB = await db.get().collection("TherapistAvailabilities").insertOne({_id: actualId(uid), days: availabilities});
		if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
			return ({success: false, message: "Error when inserting into collection"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.updateTherapistAvailabilities = async function(uid, json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.days)
			return ({success: false, message: "Informations are missing"});

		const resGettingDB = await db.get().collection("TherapistAvailabilities").findOne({_id: actualId(uid)});
		if (!resGettingDB)
			return ({success: false, message: "Error when fetching therapist's availabilities from collection. Please check if they have already been defined or not"});

		const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
		for (let i = 0; i < json.days.length; i++) {
			if (!json.days[i].day || !json.days[i].timeSlots)
				return ({success: false, message: "Informations are missing"});
			if (typeof(json.days[i].day) !== "string" || typeof(json.days[i].timeSlots) !== "object")
				return ({success: false, message: "Bad type informations in a 'days' occurence"});
			if (!validDays.includes(json.days[i].day))
				return ({success: false, message: `'${json.days[i].day}' isn't a valid day name`});

			const timeSlots = json.days[i].timeSlots;
			const timeSlotsParsingResults = timeSlotsParsing(json.days[i].day, timeSlots);
			if (!timeSlotsParsingResults.success)
				return ({success: false, message: timeSlotsParsingResults.message});
		}

		for (let j = 0; j < json.days.length; j++) {
			for (let k = 0; k < json.days.length; k++) {
				if (k === j)
					continue;
				if (json.days[k].day === json.days[j].day)
					return ({success: false, message: `'${json.days[k].day}' is already defined in list of days`});
			}
		}

		const availabilities = getOnlyGoodInformationsFromBody(json);
		const resMergeArrays = resGettingDB.days.map(obj => availabilities.find(o => o.day === obj.day) || obj);
		const resUpdt = await db.updateField({_id: actualId(uid)}, "TherapistAvailabilities", "days", resMergeArrays);
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
exports.getCurrentAvailabilities = async function(uid, query)
{
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		query.sort = "descending";
		if (query.startDate && query.endDate) {
			if (new Date(query.startDate) > new Date(query.endDate))
				return ({success: false, message: "Start date must to be earlier than end date"});

		} else if (query.startDate) {
			const now = new Date(query.startDate);
			now.setDate(now.getDate() + 7);
			query.endDate = now;

		} else if (query.endDate) {
			if (new Date(query.endDate) < new Date())
				return ({success: false, message: "When only endDate is defined, it cannot be earlier that now"});
			query.startDate = new Date();

		} else {
			query.startDate = new Date();
			const now = new Date();
			now.setDate(now.getDate() + 7);
			query.endDate = now;
		}

		const listRes = await appointmentsService.listOwnerAppointmentsWithinTimeframe(uid, query, "Therapists");
		if (!listRes.success)
			return (listRes);
		const listAvail = await module.exports.getTherapistAvailabilities(uid);
		if (!listAvail.success)
			return (listAvail);
		const currentAppointments = listRes.appointments;
		const availabilities = listAvail.res.days;

		let currentAvailabilitiesArr = [];

		const nbDays = Math.round((new Date(query.endDate).getTime() - new Date(query.startDate).getTime()) / (1000 * 3600 * 24));

		for (let i = 0; i < nbDays; i++) {
			const checkDate = new Date(query.startDate);
			checkDate.setDate(checkDate.getDate() + i);
			const day = currentAvailabilities.getDayName(checkDate.getUTCDay());
			const checkDateAsNotDateObj = checkDate.toISOString().split("T")[0];

			const dayAvailabilities = (availabilities.find(o => o.day === day)).timeSlots;
			const dayAppointments = currentAvailabilities.getAppointmentsForDay(checkDateAsNotDateObj, currentAppointments);
			const currentAvailabilitiesForDay = await currentAvailabilities.getCurrentAvailabilitiesForDay(dayAvailabilities, dayAppointments);
			currentAvailabilitiesArr.push({date: new Date(checkDateAsNotDateObj).toISOString(), timeSlots: currentAvailabilitiesForDay});
		}

		return ({success: true, res: currentAvailabilitiesArr});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};