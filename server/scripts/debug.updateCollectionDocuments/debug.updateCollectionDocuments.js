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

function connect() {
	client.connect(async (err) => {
		if (err)
			return console.log(err);

		mongodb = client.db(DBNAME);
		console.log(`Connected to database ${DBNAME}`);
	});
}

function close() {
	mongodb.close((err) => {
		if (err)
			throw err;
		console.log(`Connection to database closed.`);
	});
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

async function getAllCollectionDocuments(collectionName) {
	try {
		const dbOutput = await mongodb.collection(collectionName).find({}).toArray();
		if (!dbOutput)
			return ({success: false, message: "Error when getting all documents from database"});
		return ({success: true, data: dbOutput});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function setNewFieldToAllDocuments(collectionName, fieldName, newValue) {
	try {
		await mongodb.collection(collectionName).updateMany(
			{},
			{$set: {[fieldName]: newValue}}
		);
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function setNewFieldToAllDocumentsThatMissIt(collectionName, fieldName, newValue) {
	try {
		const dbOutput = await mongodb.collection(collectionName).updateMany(
			{[fieldName]: {$exists: false}},
			{$set: {[fieldName]: newValue}}
		);
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}

async function displayAllCollectionDocuments(collectionName) {
	try {
		const dbOutput = await mongodb.collection(collectionName).find({}).toArray();
		if (!dbOutput)
			return console.log("Error when getting all documents from database");

		console.log(dbOutput);
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.stack});
	}
}

async function main() {
	try {
		await connect();
		await setTimeout(async() => {
			try {
				await setNewFieldToAllDocumentsThatMissIt("Users", "activeTherapies", []);
				console.log("\nCollection Users:");
				await displayAllCollectionDocuments("Users");

				await setNewFieldToAllDocumentsThatMissIt("Therapists", "activeTherapies", []);
				await setNewFieldToAllDocumentsThatMissIt("Therapists", "description", "");
				await setNewFieldToAllDocumentsThatMissIt("Therapists", "tags", []);
				await setNewFieldToAllDocumentsThatMissIt("Therapists", "typesOfAppointment", []);
				console.log("\nCollection Therapists:");
				await displayAllCollectionDocuments("Therapists");

				process.exit(0); 
			} catch (exception) {
				console.log(`Error exception:\n${exception.stack}`);
				process.exit(1);
			}
		}, 1000);
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		process.exit(1);
	}
}

main();
