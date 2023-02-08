const userValidator = require("../src/schemas-validators/user.json");
const therapistValidator = require("../src/schemas-validators/therapist.json");
const locationValidator = require("../src/schemas-validators/location.json");
const specialtyValidator = require("../src/schemas-validators/specialty.json");
const appointmentValidator = require("../src/schemas-validators/appointment.json");
const therapistAvailabilitiesValidator = require("../src/schemas-validators/therapist-availabilities.json");
const adminUserValidator = require("../src/schemas-validators/adminuser.json");

const config = require("../config.json");
try {
	if (!config || !config.username || !config.password || !config.dbName || !config.accessTokenSecret || !config.refreshTokenSecret)
		throw new Error("Missing information in config file.\nConfig file should louk like that :\n\
			{\n\
				\t\"username\": \"the username\",\n\
				\t\"password\": \"the password\",\n\
				\t\"dbName\": \"name of the database\",\n\
				\t\"host\": \"the port (default: localhost)\",\n\
				\t\"port\": \"the port (default: 27017)\",\n\
				\t\"authSource\": \"the auth source (default: admin)\",\n\
				\t\"accessTokenSecret\": \"a value for the access token secret\",\n\
				\t\"refreshTokenSecret\": \"a value for the refresh token secret\"\n\
			}");
} catch (exception) {
	console.log(`Error exception:\n${exception.stack}`);
	process.exit(1);
}

const DBNAME = config.dbName;
const HOST = config.host ? config.host : "localhost";
const PORT = config.port ? config.port : "27017";
const AUTHSOURCE = config.authSource ? config.authSource : "admin";
//const DBURI = `mongodb://${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@${encodeURIComponent(HOST)}:${encodeURIComponent(PORT)}/${encodeURIComponent(DBNAME)}?authSource=${encodeURIComponent(AUTHSOURCE)}`;
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

async function connect() {
	await client.connect(async (err) => {
		if (err)
			return console.log(err);

		mongodb = client.db(DBNAME);
		console.log(`Connected to database ${DBNAME}`);

		const collections = await mongodb.listCollections({}, { nameOnly: true }).toArray();
		const collectionsIsPresent = {users: false, therapists: false, locations: false, specialties: false, appointments: false, admin: false, therapistAvailabilities: false};

		for (let i = 0; i < collections.length; i++) {
			if (collections[i].name === "Users")
				collectionsIsPresent.users = true;
			if (collections[i].name === "Therapists")
				collectionsIsPresent.therapists = true;
			if (collections[i].name === "Locations")
				collectionsIsPresent.locations = true;
			if (collections[i].name === "Specialties")
				collectionsIsPresent.specialties = true;
			if (collections[i].name === "Appointments")
				collectionsIsPresent.appointments = true;
			if (collections[i].name === "TherapistAvailabilities")
				collectionsIsPresent.therapistAvailabilities = true;
			if (collections[i].name === "AdminUsers")
				collectionsIsPresent.admin = true;
		}

		if (!collectionsIsPresent.users)
			_createCollection(mongodb, "Users", userValidator);
		if (!collectionsIsPresent.therapists)
			_createCollection(mongodb, "Therapists", therapistValidator);
		if (!collectionsIsPresent.locations)
			_createCollection(mongodb, "Locations", locationValidator);
		if (!collectionsIsPresent.specialties)
			_createCollection(mongodb, "Specialties", specialtyValidator);
		if (!collectionsIsPresent.appointments)
			_createCollection(mongodb, "Appointments", appointmentValidator);
		if (!collectionsIsPresent.therapistAvailabilities)
			_createCollection(mongodb, "TherapistAvailabilities", therapistAvailabilitiesValidator);
		if (!collectionsIsPresent.admin)
			_createCollection(mongodb, "AdminUsers", adminUserValidator);
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
			{_id: modelInstance._id },
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

module.exports = {
	connect,
	close,
	updateField,
	get,
	isConnected
};