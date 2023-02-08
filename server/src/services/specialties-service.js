const db = require("../db.js");
const actualId = require("../utils/social-auth-utils.js").actualId;

// POST
exports.addSpecialty = async function(json) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if (!json || !json.name)
			return ({success: false, message: "Informations are mising"});

		if (typeof(json.name) !== "string" || (json.acronym && typeof(json.acronym) !== "string") || (json.description && typeof(json.description) !== "string"))
			return ({success: false, message: "Bad type informations"});

		const duplicateTest = await db.get().collection("Specialties").findOne({"name": json.name});
		if (duplicateTest)
			return ({success: false, message: "Specialty already registered"});

		const resInsertDB = await db.get().collection("Specialties").insertOne({
				"name": json.name,
				"acronym": json.acronym ? json.acronym : "",
				"description": json.description ? json.description : "",
				"managedDisorders": json.managedDisorders ? json.managedDisorders: []
			});

		if (!resInsertDB.result || !resInsertDB.result.ok || resInsertDB.result.ok != 1)
			return ({success: false, message: "Error when inserting into collection"});

		return ({success: true, specialtyId: resInsertDB.insertedId});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.listSpecialties = async function() {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const dbRes = await db.get().collection("Specialties").find({}).toArray();
		if (!dbRes)
			return ({success: false, message: "Error when fetching specialties from the database"});

		return ({success: true, specialties: dbRes});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// GET
exports.retrieveSpecialtyById = async function(id) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const dbRes = await db.get().collection("Specialties").findOne({_id: actualId(id)});
		if (!dbRes)
			return ({success: false, message: "Error when fetching specialty from the database"});

		return ({success: true, specialty: dbRes});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// PATCH
exports.updateSpecialtyWithId = async function(id, body) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		if ((body.name && typeof(body.name) !== "string") || (body.acronym && typeof(body.acronym) !== "string") || (body.description && typeof(body.description) !== "string") || (body.managedDisorders && (typeof(body.managedDisorders) !== "object" || !body.managedDisorders.length)))
			return ({success: false, message: "Bad type of parameters"});

		const specialty = await db.get().collection("Specialties").findOne({_id: actualId(id)});
		if (!specialty)
			return ({success: false, message: "Error when fetching specialty"});

		if (body.name) {
			const resUpdt = await db.updateField(specialty, "Specialties", "name", body.name);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.acronym) {
			const resUpdt = await db.updateField(specialty, "Specialties", "acronym", body.acronym);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.description) {
			const resUpdt = await db.updateField(specialty, "Specialties", "description", body.description);
			if (!resUpdt.success)
				return ({success: false, message: resUpdt.message});
		}

		if (body.managedDisorders) {
			// remove all managed disorders
			const dbResRemove = await db.get().collection("Specialties").updateOne({_id: specialty._id}, {$unset: {managedDisorders: ""}});
			if (!dbResRemove.result || !dbResRemove.result.ok || dbResRemove.result.ok != 1)
				return ({success: false, message: "Error when updating managed disorders to specialty"});

			// add managed disorders
			const dbRes = await db.get().collection("Specialties").updateOne({_id: specialty._id}, {$set: {managedDisorders: body.managedDisorders}});
			if (!dbRes.result || !dbRes.result.ok || dbRes.result.ok != 1)
				return ({success: false, message: "Error when updating managed disorders to specialty"});
		}

		return ({success: true});
	} catch(exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

// DELETE
exports.deleteSpecialtyWithId = async function(id) {
	try {
		if (!db.get())
			return ({success: false, message: "There is no database"});

		const resDeletingDB = await db.get().collection("Specialties").deleteOne({_id: actualId(id)});
		if (!resDeletingDB.result || !resDeletingDB.result.ok || resDeletingDB.result.ok != 1 || resDeletingDB.deletedCount !== 1)
			return ({success: false, message: "Error when deleting specialty from the database"});

		return ({success: true});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};
