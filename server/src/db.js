/**
 * Database related functions of the Psynder' server.
 * @module module:Database
 */

// TODO: doc

const userValidator = require("./schemas-validators/user.json");
const therapistValidator = require("./schemas-validators/therapist.json");
const locationValidator = require("./schemas-validators/location.json");
const specialtyValidator = require("./schemas-validators/specialty.json");
const appointmentValidator = require("./schemas-validators/appointment.json");
const therapistAvailabilitiesValidator = require("./schemas-validators/therapist-availabilities.json");
const adminUserValidator = require("./schemas-validators/adminuser.json");
const appointmentTypesValidator = require("./schemas-validators/appointment-types.json");
const communicationSystemValidator = require("./schemas-validators/communication-system.json");

/**
 * The server needs his config file to work properly.
 * @requires config.json
 * @external "config.json"
 * @example {
 *    "mobileAppVersion": "major.minor.fix",
 *    "username": "the username",
 *    "password": "the password",
 *    "dbName": "name of the database",
 *    "host": "the port (default: localhost)",
 *    "port": "the port (default: 27017)",
 *    "authSource": "the auth source (default: admin)",
 *    "accessTokenSecret": "accessTokenSecret",
 *    "refreshTokenSecret": "refreshTokenSecret",
 *     "bot": {
 *        "prefix": "! (prefix for commands)",
 *        "token": "the Discord bot's token",
 *        "idLogChannel": "ID of the Discord textual channel to send logs",
 *        "whitelist": ["id of user 1", "id of user 2", "id of user X"]
 *    },
 *    "maintenance": {
 *        "isIn": false,
 *        "retryAfter": ""
 *    },
 *    "redis": {
 *        "host": "Redis host",
 *        "password": "Redis password"
 *    },
 *    "emailTransporter": {
 *        "port": Port for the email transporter (as int),
 *        "host": "ex: smtp.gmail.com",
 *        "addr": "Email adress",
 *        "password": "Email password"
 *    }
 * }
 */
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

/**
 * Global that stores the name of the database we're working with.
 * @global
 * @constant
 * @type {string}
 */
const DBNAME = config.dbName;

/**
 * Global that stores the host of our database. By default it is **"localhost"**
 * 
 * __/!\ Warning : If the database is stored in a local docker container, it may be the name of the container not "localhost" /!\\__
 * @global
 * @constant
 * @type {string}
 * @default "localhost"
 */
const HOST = config.host ? config.host : "localhost";

/**
 * Global that stores the port of our database. By default it is **"27017"**
 * 
 * __/!\ Warning : If the database is stored in a local docker container, it may be the port you linked to /!\\__
 * @global
 * @constant
 * @type {string}
 * @default "27017"
 */
const PORT = config.port ? config.port : "27017";

/**
 * Global that stores the auth source of the database the user is created in. By default it is **"admin"**.
 * @global
 * @constant
 * @type {string}
 * @default "admin"
 */
const AUTHSOURCE = config.authSource ? config.authSource : "admin";

/**
 * Global that stores the URI needed by MongoDB to connect to a database with a username, password, host, port, database's name and auth.
 * 
 * It should look like that **mongodb://\<username\>:\<password\>@\<host\>:\<port\>/\<database's name\>?authSource=\<auth source\>**
 * @global
 * @constant
 * @type {string}
 * @default "admin"
 */
const DBURI = `mongodb://${encodeURIComponent(config.username)}:${encodeURIComponent(config.password)}@${encodeURIComponent(HOST)}:${encodeURIComponent(PORT)}/${encodeURIComponent(DBNAME)}?authSource=${encodeURIComponent(AUTHSOURCE)}`;
//const DBURI = "mongodb://localhost:27017/dbPsynder";

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

/**
 * Function to create a collection in the database.
 * @function _createCollection
 * @param {string} collectionName - The name of the collection.
 * @param {object} schemaValidator - The schema validation for the collection.
 */
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

/**
 * Function to connect to the database.
 * @function connect
 */
function connect() {
	client.connect(async (err) => {
		if (err) {
			if (!process.env.runsInDev)
				bot.sendLog(`MongoDB Error : ${err.toString()}`);
			return console.log(err);
		}

		mongodb = client.db(DBNAME);
		console.log(`Connected to database ${DBNAME}`);

		const collections = await mongodb.listCollections({}, { nameOnly: true }).toArray();
		const collectionsIsPresent = {users: false, therapists: false, locations: false, specialties: false, appointments: false, admin: false, therapistAvailabilities: false, appointmentTypes: false, communicationSystem: false};

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
			if (collections[i].name === "AppointmentTypes")
				collectionsIsPresent.appointmentTypes = true;
			if (collections[i].name === "CommunicationSystem")
				collectionsIsPresent.communicationSystem = true;
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
		if (!collectionsIsPresent.appointmentTypes)
			_createCollection(mongodb, "AppointmentTypes", appointmentTypesValidator);
		if (!collectionsIsPresent.communicationSystem)
			_createCollection(mongodb, "CommunicationSystem", communicationSystemValidator);
	});
}

/**
 * Function to close the connection to the database.
 * @function close
 */
function close() {
	mongodb.close((err) => {
		if (err)
			throw err;
		console.log(`Connection to database closed.`);
	});
}

/**
 * Function to get the database as an object.
 * @function get
 */
function get() {
	return mongodb;
}

/**
 * Function to get the database as an object.
 * @function isConnected
 */
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

/**
 * Function to update a model instance field in the database.
 * @async
 * @function updateField
 * @param {object} modelInstance - The model instance
 * @param {string} collectionName - The collection name
 * @param {string} fieldName - The name of the fieldto be updated
 * @param {object} newValue - The new value for the field in the model instance
 */
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

/**
 * Function to update many fields of a model instance in the database.
 * @async
 * @function updateManyFields
 * @param {object} modelInstance - The model instance
 * @param {string} collectionName - The collection name
 * @param {object} obj - Object with field names and their new values
 */
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
