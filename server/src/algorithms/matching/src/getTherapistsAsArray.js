const db = require("../../../db.js");

module.exports = async function() {
	try {
		if (!db.get())
			throw Error("There is no database");

		// Get all therapists
		const resGettingDB = await db.get().collection("Therapists").find({});
		if (!resGettingDB)
			throw Error("There is no therapist in the database");

		// Transform mondoDB 'cursor' as array to return it
		const therapistsArray = await resGettingDB.toArray();

		return ({success: true, res: therapistsArray});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

/**
 * Module that get all thrapists from the database and store them in an array.
 * 
 * Code with comments:
 * ```
async function() {
	try {
		if (!db.get())
			throw Error("There is no database");

		// Get all therapists
		const resGettingDB = await db.get().collection("Therapists").find({});
		if (!resGettingDB)
			throw Error("There is no therapist in the database");

		// Transform mondoDB 'cursor' as array to return it
		const therapistsArray = await resGettingDB.toArray();

		return ({success: true, res: therapistsArray});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}
```
 * @module module:getTherapistsAsArray
 * @see module:matching
 */