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

function createCollection(db, collectionName, schemaValidator = null) {
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
	});
}

async function getCollectionNames()
{
	const res = await mongodb.listCollections({}, { nameOnly: true }).toArray();
	return res;
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
	isConnected,
	getCollectionNames,
	createCollection
};