const db = require("../db.js");
const actualId = require("../utils/social-auth-utils.js").actualId;

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

async function checkIfMessagesExistBetweenUsers(userId, therapistId)
{
	const resGettingDB = await db.get().collection("CommunicationSystem").findOne({user: userId, therapist: therapistId});
	if (!resGettingDB)
		return ({success: false});

	return ({success: true, instance: resGettingDB});
}

// POST
exports.addMessage = async function(uid, body, senderIsTherapist)
{
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!body || !body.receiver || !body.content)
			return ({success: false, message: "Informations are missing"});

		if (typeof(body.receiver) !== "string" || typeof(body.content) !== "string")
			return ({success: false, message: "Bad type informations"});

		let user;
		let therapist;

		if (senderIsTherapist) {
			const getTherapist = await _getTherapistById(uid);
			if (!getTherapist.success)
				return ({success: false, message: "Error when fetching therapist from collection"});
			therapist = getTherapist.therapist;

			const getUser = await _getUserById(body.receiver);
			if (!getUser.success)
				return ({success: false, message: "Error when fetching user from collection"});
			user = getUser.user;
		} else {
			const getTherapist = await _getTherapistById(body.receiver);
			if (!getTherapist.success)
				return ({success: false, message: "Error when fetching therapist from collection"});
			therapist = getTherapist.therapist;

			const getUser = await _getUserById(uid);
			if (!getUser.success)
				return ({success: false, message: "Error when fetching user from collection"});
			user = getUser.user;
		}

		const newMessage = {
			date: new Date().toISOString(),
			sender: senderIsTherapist ? "therapist" : "user",
			content: body.content
		};

		const resGettingMessages = await checkIfMessagesExistBetweenUsers(user._id, therapist._id);
		if (!resGettingMessages.success) {
			const newMessageInstance = {
				user: user._id,
				therapist: therapist._id,
				messages: [newMessage]
			};

			const resAddingDB = await db.get().collection("CommunicationSystem").insertOne(newMessageInstance);
			if (!resAddingDB)
				return ({success: false, message: "Error when registering message to collection"});
		} else {
			const newMessagesArray = resGettingMessages.instance.messages;
			newMessagesArray.push(newMessage);

			const resUpdt = await db.updateField(resGettingMessages.instance, "CommunicationSystem", "messages", newMessagesArray);
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


// GET
exports.getMessages = async function(uid, rid, senderIsTherapist, nLasts = 0)
{
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		let user;
		let therapist;

		if (senderIsTherapist) {
			const getTherapist = await _getTherapistById(uid);
			if (!getTherapist.success)
				return ({success: false, message: "Error when fetching therapist from collection"});
			therapist = getTherapist.therapist;

			const getUser = await _getUserById(rid);
			if (!getUser.success)
				return ({success: false, message: "Error when fetching user from collection"});
			user = getUser.user;
		} else {
			const getTherapist = await _getTherapistById(rid);
			if (!getTherapist.success)
				return ({success: false, message: "Error when fetching therapist from collection"});
			therapist = getTherapist.therapist;

			const getUser = await _getUserById(uid);
			if (!getUser.success)
				return ({success: false, message: "Error when fetching user from collection"});
			user = getUser.user;
		}

		const resGettingMessages = await checkIfMessagesExistBetweenUsers(user._id, therapist._id);
		if (!resGettingMessages.success)
			return ({success: false, message: "There are no messages between the user and the therapist"});

		const instanceMessages = resGettingMessages.instance.messages;
		const messages = nLasts > 0 && nLasts < instanceMessages.length ? instanceMessages.slice(instanceMessages.length - nLasts) : instanceMessages;
		return ({success: true, messages: messages});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		if (process.env.runsInDev === "false")
			bot.sendLog(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};