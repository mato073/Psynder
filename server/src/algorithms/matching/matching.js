const getTherapistsAsArray = require("./src/getTherapistsAsArray.js");
const matchingUserTherapist = require("./src/matchingUserTherapist.js");

module.exports = async function(user) {
	try {
		const results = [];

		// First we try to get all thrapists from the database and store them in an array
		const tryGetTherapists = await getTherapistsAsArray();
		if (!tryGetTherapists.success)
			return ({success: false, message: tryGetTherapists.message});
		const therapists = tryGetTherapists.res;

		// Here we'll loop on each therapist to have a perecentage of matching with  
		for (let i = 0; i < therapists.length; i ++) {
			const therapist = therapists[i];
			const resMatch = await matchingUserTherapist(user, therapist);
			// if an error occured in previous function call, we return in cascade the error
			if (resMatch.message)
				return ({success: false, message: resMatch.message});
			// if the matching is superior to 0, we add it in the results we'll send at the end 
			if (resMatch.matchingPercentage > 0)
				results.push(resMatch);
		}

		return ({success: true, results: results});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
};

/**
 * Module with main loop of the algorithm to match user's potential depression disorders with therapist that may can help him.
 * 
 * Code with comments:
 * ```
async function(user) {
	try {
		const results = [];

		// First we try to get all thrapists from the database and store them in an array
		const tryGetTherapists = await getTherapistsAsArray();
		if (!tryGetTherapists.success)
			return ({success: false, message: tryGetTherapists.message});
		const therapists = tryGetTherapists.res;

		// Here we'll loop on each therapist to have a perecentage of matching with  
		for (let i = 0; i < therapists.length; i ++) {
			const therapist = therapists[i];
			const resMatch = await matchingUserTherapist(user, therapist);
			// if an error occured in previous function call, we return in cascade the error
			if (resMatch.message)
				return ({success: false, message: resMatch.message});
			// if the matching is superior to 0, we add it in the results we'll send at the end 
			if (resMatch.matchingPercentage > 0)
				results.push(resMatch);
		}

		return ({success: true, results: results});
	} catch (exception) {
		console.log(`Error exception:\n${exception.stack}`);
		return ({success: false, message: exception.message});
	}
}
```
 * @module module:matching
 * @see module:getTherapistsAsArray
 * @see module:matchingUserTherapist
 */