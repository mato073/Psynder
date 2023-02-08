const db = require("../../../db.js");

module.exports = async function(specialtiesIDs) {
	try {
		const specialties = [];

		if (!db.get())
			throw Error("There is no database");

		// We do loop on each ID to get it from the database
		for (let i = 0; i < specialtiesIDs.length; i++) {
			const fullSpecialty = await db.get().collection("Specialties").findOne({"_id": specialtiesIDs[i]});
			if (!fullSpecialty)
				throw Error("Error when fetching therapist specialty");
			// if ID matchs with a specialty, we add it to the array that will be returned
			specialties.push(fullSpecialty);
		}

		return ({success: true, specialties: specialties});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

/**
 * Module that get specialties of the therapist from their ID.
 * 
 * Code with comments:
 * ```
async function(specialtiesIDs) {
	try {
		const specialties = [];

		if (!db.get())
			throw Error("There is no database");

		// We do loop on each ID to get it from the database
		for (let i = 0; i < specialtiesIDs.length; i++) {
			const fullSpecialty = await db.get().collection("Specialties").findOne({"_id": specialtiesIDs[i]});
			if (!fullSpecialty)
				throw Error("Error when fetching therapist specialty");
			// if ID matchs with a specialty, we add it to the array that will be returned
			specialties.push(fullSpecialty);
		}

		return ({success: true, specialties: specialties});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}
```
 * @module module:getSpecialtiesFromIDs
 * @see module:matchingUserTherapist
 */