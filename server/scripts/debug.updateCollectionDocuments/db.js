const DBNAME = "dbPsynder";
const DBURI = "mongodb://localhost:27017/dbPsynder";

// const Logger = require("mongodb").Logger;
const mongoClient = require("mongodb").MongoClient;
let client;
try {
	client = new mongoClient(DBURI, {useUnifiedTopology: true});
// 	Logger.setLevel("debug");
} catch (exception) {
	console.log(`Error exception:\n${exception.stack}`);
	process.exit(1);
}

let mongodb;

function _createCollection(db, collectionName, schemaValidator = null) {
	if (schemaValidator) {
		db.createCollection(collectionName, schemaValidator, function(error, res) {
			if (error)
				throw error;
			console.log(`Collection ${collectionName} created, schema validator in effect.`);
		});
		return;
	}
	db.createCollection(collectionName, function(error, res) {
		if (error)
			throw error;
		console.log(`Collection ${collectionName} created`);
	});
}

function connect() {
	client.connect(async (err) => {
		if (err)
			return console.log(err);

		mongodb = client.db(DBNAME);
		console.log(`Connected to database ${DBNAME}`);

		// const collections = await mongodb.listCollections({}, { nameOnly: true }).toArray();
		// const collectionsIsPresent = {users: false, therapists: false, locations: false, specialties: false, appointments: false, admin: false, therapistAvailabilities: false, appointmentTypes: false, communicationSystem: false};

		// for (let i = 0; i < collections.length; i++) {
		// 	if (collections[i].name === "Users")
		// 		collectionsIsPresent.users = true;
		// 	if (collections[i].name === "Therapists")
		// 		collectionsIsPresent.therapists = true;
		// 	if (collections[i].name === "Locations")
		// 		collectionsIsPresent.locations = true;
		// 	if (collections[i].name === "Specialties")
		// 		collectionsIsPresent.specialties = true;
		// 	if (collections[i].name === "Appointments")
		// 		collectionsIsPresent.appointments = true;
		// 	if (collections[i].name === "TherapistAvailabilities")
		// 		collectionsIsPresent.therapistAvailabilities = true;
		// 	if (collections[i].name === "AdminUsers")
		// 		collectionsIsPresent.admin = true;
		// 	if (collections[i].name === "AppointmentTypes")
		// 		collectionsIsPresent.appointmentTypes = true;
		// 	if (collections[i].name === "CommunicationSystem")
		// 		collectionsIsPresent.communicationSystem = true;
		// }

		// if (!collectionsIsPresent.users)
		// 	_createCollection(mongodb, "Users", userValidator);
		// if (!collectionsIsPresent.therapists)
		// 	_createCollection(mongodb, "Therapists", therapistValidator);
		// if (!collectionsIsPresent.locations)
		// 	_createCollection(mongodb, "Locations", locationValidator);
		// if (!collectionsIsPresent.specialties)
		// 	_createCollection(mongodb, "Specialties", specialtyValidator);
		// if (!collectionsIsPresent.appointments)
		// 	_createCollection(mongodb, "Appointments", appointmentValidator);
		// if (!collectionsIsPresent.therapistAvailabilities)
		// 	_createCollection(mongodb, "TherapistAvailabilities", therapistAvailabilitiesValidator);
		// if (!collectionsIsPresent.admin)
		// 	_createCollection(mongodb, "AdminUsers", adminUserValidator);
		// if (!collectionsIsPresent.appointmentTypes)
		// 	_createCollection(mongodb, "AppointmentTypes", appointmentTypesValidator);
		// if (!collectionsIsPresent.communicationSystem)
		// 	_createCollection(mongodb, "CommunicationSystem", communicationSystemValidator);
	});
}

function close() {
	mongodb.close((err) => {
		if (err)
			throw err;
		console.log(`Connection to database closed.`);
	});
}

function get() {
	return mongodb;
}

async function isConnected() {
	try {
		const collections = await mongodb.listCollections({}, {nameOnly: true, maxTimeMS: 1000}).toArray();
		if (collections !== undefined)
			return true;
		return false;
	} catch (exception) {
		return false;
	}
}

async function updateField(modelInstance, collectionName, fieldName, newValue) {
	try {
		let updatePair = {};
		updatePair[fieldName] = newValue;

		const dbOutput = await mongodb.collection(collectionName).updateOne(
			{_id: modelInstance._id},
			{$set: updatePair}
		);
		if (!dbOutput.result || !dbOutput.result.ok || dbOutput.result.ok != 1)
			return ({success: false, message: `Error when updating the field '${fieldName}' in database`});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function updateManyFields(modelInstance, collectionName, obj) {
	try {
		const dbOutput = await mongodb.collection(collectionName).updateOne(
			{_id: modelInstance._id},
			{$set: obj}
		);
		if (!dbOutput.result || !dbOutput.result.ok || dbOutput.result.ok != 1)
			return ({success: false, message: "Error when updating fields in database"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

module.exports = {
	connect,
	close,
	updateField,
	get,
	isConnected,
	updateManyFields
};

async function getAllCollectionDocuments(collectionName) {
	try {
		const dbOutput = await mongodb.collection(collectionName).find({}).toArray();
		if (!dbOutput.result || !dbOutput.result.ok || dbOutput.result.ok != 1)
			return ({success: false, message: "Error when getting all documents from database"});
		return ({success: true, data: dbOutput});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function setNewFieldToAllDocuments(collectionName, fieldName, newValue) {
	try {
		const dbOutput = await mongodb.collection(collectionName).updateMany(
			{},
			{$set: {[fieldName]: newValue}}
		);
		if (!dbOutput.result || !dbOutput.result.ok || dbOutput.result.ok != 1)
			return ({success: false, message: "Error when setting new field to all documents in database"});
		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function displayAllCollectionDocuments(collectionName) {
	try {
		const dbOutput = await mongodb.collection(collectionName).find({}).toArray();
		if (!dbOutput.result || !dbOutput.result.ok || dbOutput.result.ok != 1)
			return console.log("Error when getting all documents from database");
		console.log(dbOutput);
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.stack});
	}
}

async function main() {
	try {
		connect();
		// const resUpdate = setNewFieldToAllDocuments("Users", "activeTherapies", []);
		// if (!PaymentRequestUpdateEvent.success)
		// 	throw new Error(PaymentRequestUpdateEvent.message);
		await displayAllCollectionDocuments("Users");
		close();
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
	}
}

main();